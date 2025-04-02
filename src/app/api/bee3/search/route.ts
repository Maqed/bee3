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
 * sort ----> sorting by what? only accepts (price, date)
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
  if (!categoryPath && !search)
    return NextResponse.json({ error: "invalid-query" }, { status: 400 });

  const pageNum = +(request.nextUrl.searchParams.get("page") ?? 1);
  const pageSize = Math.min(
    Math.max(
      +(request.nextUrl.searchParams.get("pageSize") ?? DEFAULT_PAGE_SIZE),
      MIN_PAGE_SIZE,
    ),
    MAX_PAGE_SIZE,
  );

  let price = request.nextUrl.searchParams.get("price"); // 20-40000
  if (price && price.split("-").length !== 2) price = null;

  const sort = request.nextUrl.searchParams.get("sort"); // price, date
  let order =
    Prisma.SortOrder[
    request.nextUrl.searchParams.get("order") as keyof typeof Prisma.SortOrder
    ]; // asc, desc
  if (!order) order = Prisma.SortOrder.desc;

  const govId = request.nextUrl.searchParams.get("governorate");
  const cityId = request.nextUrl.searchParams.get("city");

  const attributeFilters = parseAttributeFilters(request);
  const attributeConditions = buildAttributeConditions(attributeFilters);

  const paths = categoryPath
    ? [categoryPath].concat(getSubCategoryPaths(categoryPath))
    : [];

  const searchQuery = search
    ? search
      .trim()
      .split(" ")
      .map((word) => `${word}:*`)
      .join(" & ")
    : undefined;

  const queryWhereClause = {
    categoryPath: paths.length > 0 ? { in: paths } : undefined,
    title: searchQuery ? { search: searchQuery } : undefined,
    price: price
      ? { gte: +price.split("-")[0]!, lte: +price.split("-")[1]! }
      : undefined,
    governorate: govId ? { id: +govId } : undefined,
    city: cityId ? { id: +cityId } : undefined,
    AND: attributeConditions.length > 0 ? attributeConditions : undefined,
  };
  const adsPromise = db.ad.findMany({
    orderBy: [
      {
        _relevance: searchQuery
          ? {
            fields: ["title"],
            search: searchQuery,
            sort: "asc",
          }
          : undefined,
      },
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
 * Parse attribute filters from the request URL
 * Supports both single value and range queries
 */
function parseAttributeFilters(request: NextRequest): { name: string; value: string }[] {
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
function buildAttributeConditions(attributeFilters: { name: string; value: string }[]): any[] {
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
              AND: [
                { value: { gte: minValue } },
                { value: { lte: maxValue } }
              ]
            }
          }
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
            }
          }
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
          }
        }
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
      const subPath = `${rootPath}/${toPathFormat(subTree.name_en)}`;
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
    tree = tree.find((c) => toPathFormat(c.name_en) == segment)!
      .categories as CategoryTreeItem[];
  }
  return tree;
}
