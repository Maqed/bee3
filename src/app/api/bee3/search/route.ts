import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { categoriesTree, CategoryTreeItem } from "@/schema/categories-tree";
import { toPathFormat } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import {
  DEFAULT_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "@/consts/ad-search";

/**
 * Toggle visibility of a content tab
 * category ----> get the category of the ads
 * page ----> get the page number (used in pagination)
 * pageSize ----> number of ads to be fetched
 * q ----> search query
 * price ----> price range of the ads, written in this format (min-max) ex: (20-40000)
 * sort ----> sorting by what? only accepts (price, date, relevance)
 * order ----> order of the ads, by default it's descending
 * governorate ----> add governorate filter to query (id)
 * city ----> add city filter to query (id)
 * attrs ----> filter by attributes in format: attributeName=value or attributeName=minValue-maxValue
 *  For multiple attributes, use multiple attrs parameters or comma-separated values
 *  Example: attrs=ram=8GB&attrs=processor=Intel
 *  Example for range: attrs=screen_size=5-7
 */
export async function GET(request: NextRequest) {
  const categoryPath = request.nextUrl.searchParams.get("category");
  const search = request.nextUrl.searchParams.get("q");

  const pageNum = +(request.nextUrl.searchParams.get("page") ?? 1);
  const pageSize = Math.min(
    Math.max(
      +(request.nextUrl.searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE),
      MIN_PAGE_SIZE,
    ),
    MAX_PAGE_SIZE,
  );

  let price = request.nextUrl.searchParams.get("price");
  if (price && price.split("-").length !== 2) price = null;

  const sort = request.nextUrl.searchParams.get("sort");
  let order =
    Prisma.SortOrder[
      request.nextUrl.searchParams.get("order") as keyof typeof Prisma.SortOrder
    ];
  if (!order) order = Prisma.SortOrder.desc;

  const govId = request.nextUrl.searchParams.get("governorate");
  const cityId = request.nextUrl.searchParams.get("city");

  const attributeFilters = parseAttributeFilters(request);
  const attributeConditions = buildAttributeConditions(attributeFilters);

  const paths = categoryPath
    ? [categoryPath].concat(getSubCategoryPaths(categoryPath))
    : [];

  if (search) {
    const similarityThreshold = 0.25;
    const fuzzySearchResults = await performFuzzySearch({
      searchTerm: search.trim(),
      categoryPaths: paths,
      price,
      govId,
      cityId,
      attributeConditions,
      sort,
      order,
      pageNum,
      pageSize,
      similarityThreshold,
    });

    return NextResponse.json(fuzzySearchResults);
  }

  // Fallback for category-only queries (no search term)
  const queryWhereClause = {
    categoryPath: paths.length > 0 ? { in: paths } : undefined,
    price: price
      ? { gte: +price.split("-")[0]!, lte: +price.split("-")[1]! }
      : undefined,
    governorate: govId ? { id: +govId } : undefined,
    city: cityId ? { id: +cityId } : undefined,
    AND: attributeConditions.length > 0 ? attributeConditions : undefined,
  };

  const adsPromise = db.ad.findMany({
    orderBy: [
      { price: sort === "price" ? order : undefined },
      { createdAt: sort === "date" ? order : undefined },
    ],
    where: queryWhereClause,
    include: {
      images: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
  });

  const totalAdsPromise = db.ad.count({
    where: queryWhereClause,
  });

  const [ads, totalAds] = await Promise.all([adsPromise, totalAdsPromise]);
  const totalPages = Math.ceil(totalAds / pageSize);

  return NextResponse.json({ ads, totalAds, totalPages });
}

/**
 * Improved fuzzy search using PostgreSQL word_similarity
 */
async function performFuzzySearch({
  searchTerm,
  categoryPaths,
  price,
  govId,
  cityId,
  attributeConditions,
  sort,
  order,
  pageNum,
  pageSize,
  similarityThreshold,
}: {
  searchTerm: string;
  categoryPaths: string[];
  price: string | null;
  govId: string | null;
  cityId: string | null;
  attributeConditions: any[];
  sort: string | null;
  order: Prisma.SortOrder;
  pageNum: number;
  pageSize: number;
  similarityThreshold: number;
}) {
  // Split search term into words
  const searchWords = searchTerm.split(/\s+/).filter((word) => word.length > 0);
  if (searchWords.length === 0) {
    return { ads: [], totalAds: 0, totalPages: 0 };
  }

  // Build base conditions and parameters
  const baseConditions: string[] = [];
  let queryParams: any[] = [...searchWords]; // Words for similarity comparison
  let paramIndex = searchWords.length + 1; // Start index after search words

  // Add word similarity conditions for each search word
  const wordSimilarityConditions = searchWords
    .map((_, i) => `word_similarity($${i + 1}, "Ad".title) > $${paramIndex}`)
    .join(" OR ");

  baseConditions.push(`(${wordSimilarityConditions})`);
  queryParams.push(similarityThreshold);
  paramIndex++;

  // Add category filter
  if (categoryPaths.length > 0) {
    const placeholders = categoryPaths.map(() => `$${paramIndex++}`).join(", ");
    baseConditions.push(`"categoryPath" IN (${placeholders})`);
    queryParams.push(...categoryPaths);
  }

  // Add price filter
  if (price) {
    const [minPrice, maxPrice] = price.split("-");
    baseConditions.push(
      `price >= $${paramIndex} AND price <= $${paramIndex + 1}`,
    );
    queryParams.push(+minPrice!, +maxPrice!);
    paramIndex += 2;
  }

  // Add governorate filter
  if (govId) {
    baseConditions.push(`"governorateId" = $${paramIndex}`);
    queryParams.push(+govId);
    paramIndex++;
  }

  // Add city filter
  if (cityId) {
    baseConditions.push(`"cityId" = $${paramIndex}`);
    queryParams.push(+cityId);
    paramIndex++;
  }

  // Build ORDER BY clause
  let orderByClause = "";
  if (sort === "relevance" || !sort) {
    // Use the maximum word similarity score for ordering
    const similarityScores = searchWords
      .map((_, i) => `word_similarity($${i + 1}, "Ad".title)`)
      .join(", ");

    orderByClause = `ORDER BY GREATEST(${similarityScores}) ${order === "asc" ? "ASC" : "DESC"}`;
  } else if (sort === "price") {
    orderByClause = `ORDER BY price ${order}`;
  } else if (sort === "date") {
    orderByClause = `ORDER BY "createdAt" ${order}`;
  }

  // Handle attribute filters
  for (const condition of attributeConditions) {
    const attrName = condition.attributeValues.some.attribute.name;

    if (condition.attributeValues.some.AND) {
      // Range query
      const gteValue = condition.attributeValues.some.AND[0].value.gte;
      const lteValue = condition.attributeValues.some.AND[1].value.lte;

      baseConditions.push(`
        EXISTS (
          SELECT 1 FROM "AttributeValue" av
          JOIN "CategoryAttribute" a ON av."attributeId" = a.id
          WHERE av."adId" = "Ad".id 
          AND a.name = $${paramIndex}
          AND av.value::numeric >= $${paramIndex + 1}
          AND av.value::numeric <= $${paramIndex + 2}
        )
      `);
      queryParams.push(attrName, gteValue, lteValue);
      paramIndex += 3;
    } else {
      // Exact match
      const exactValue = condition.attributeValues.some.value;

      baseConditions.push(`
        EXISTS (
          SELECT 1 FROM "AttributeValue" av
          JOIN "CategoryAttribute" a ON av."attributeId" = a.id
          WHERE av."adId" = "Ad".id 
          AND a.name = $${paramIndex}
          AND av.value = $${paramIndex + 1}
        )
      `);
      queryParams.push(attrName, exactValue);
      paramIndex += 2;
    }
  }

  const whereClause =
    baseConditions.length > 0 ? `WHERE ${baseConditions.join(" AND ")}` : "";

  // Main query with word similarity scoring
  const mainQuery = `
    SELECT 
      "Ad".*,
      GREATEST(${searchWords
        .map((_, i) => `word_similarity($${i + 1}, "Ad".title)`)
        .join(", ")}) AS similarity_score,
      (
        SELECT json_agg(json_build_object('url', url))
        FROM "Image" 
        WHERE "adId" = "Ad".id 
        LIMIT 1
      ) as images
    FROM "Ad"
    ${whereClause}
    ${orderByClause}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  // Count query
  const countQuery = `
    SELECT COUNT(*) as total
    FROM "Ad"
    ${whereClause}
  `;

  // Add pagination parameters
  const paginationParams = [pageSize, (pageNum - 1) * pageSize];
  const mainQueryParams = [...queryParams, ...paginationParams];
  const countQueryParams = queryParams; // No pagination for count

  try {
    const [adsResult, countResult] = await Promise.all([
      db.$queryRawUnsafe(mainQuery, ...mainQueryParams),
      db.$queryRawUnsafe(countQuery, ...countQueryParams),
    ]);

    const ads = (adsResult as any[]).map((ad) => ({
      ...ad,
      images: ad.images || [],
      similarity_score: ad.similarity_score,
    }));

    const totalAds = Number((countResult as any[])[0].total);
    const totalPages = Math.ceil(totalAds / pageSize);

    return { ads, totalAds, totalPages };
  } catch (error) {
    console.error("Fuzzy search error:", error);
    throw new Error("Failed to perform fuzzy search");
  }
}

/**
 * Parse attribute filters from the request URL
 * Supports both single value and range queries
 */
function parseAttributeFilters(
  request: NextRequest,
): { name: string; value: string }[] {
  const attributeFilters: { name: string; value: string }[] = [];

  // Get all attribute parameters (can be multiple)
  const attrParams = request.nextUrl.searchParams.getAll("attrs");

  for (const attrParam of attrParams) {
    // Handle comma-separated attribute filters
    const attrFilters = attrParam.split(",");

    for (const filter of attrFilters) {
      const [name, value] = filter.split("=");
      if (name && value) {
        attributeFilters.push({ name: name.trim(), value: value.trim() });
      }
    }
  }

  return attributeFilters;
}

/**
 * Build Prisma conditions for attribute filtering
 * Handles both exact matches and range queries
 */
function buildAttributeConditions(
  attributeFilters: { name: string; value: string }[],
): any[] {
  const conditions: any[] = [];

  for (const filter of attributeFilters) {
    // Check if it's a range query (has a hyphen and both sides are numeric)
    const isRange = filter.value.includes("-");

    if (isRange) {
      const [minValue, maxValue] = filter.value.split("-");

      // Check if both values are numeric
      if (!isNaN(Number(minValue)) && !isNaN(Number(maxValue))) {
        // Numeric range query
        conditions.push({
          attributeValues: {
            some: {
              attribute: {
                name: filter.name,
              },
              AND: [{ value: { gte: minValue } }, { value: { lte: maxValue } }],
            },
          },
        });
      } else {
        // Handle as exact match if not numeric range
        conditions.push({
          attributeValues: {
            some: {
              attribute: {
                name: filter.name,
              },
              value: filter.value,
            },
          },
        });
      }
    } else {
      // Exact match query
      conditions.push({
        attributeValues: {
          some: {
            attribute: {
              name: filter.name,
            },
            value: filter.value,
          },
        },
      });
    }
  }

  return conditions;
}

// Returns a string array of all sub categories in the given path recursively.
function getSubCategoryPaths(rootPath: string): string[] {
  const subPaths = Array<string>();

  const tree = getTreeFromPath(rootPath);
  if (tree) {
    for (const subTree of tree) {
      const subPath = `${rootPath}/${toPathFormat(subTree.name)}`;
      subPaths.push(subPath);
      subPaths.push(...getSubCategoryPaths(subPath));
    }
  }

  return subPaths;
}

// Traverses the categoriesTree structure to find the specified path within the tree..
// ..so that it's possible to get its children.
function getTreeFromPath(path: string): CategoryTreeItem[] {
  const segments = path.split("/");
  let tree = categoriesTree;
  for (const segment of segments) {
    tree = tree.find((c) => toPathFormat(c.name) == segment)!
      .categories as CategoryTreeItem[];
  }
  return tree;
}
