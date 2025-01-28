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

  const paths = categoryPath
    ? [categoryPath].concat(getSubCategoryPaths(categoryPath))
    : [];

  const adsPromise = db.ad.findMany({
    orderBy: [
      {
        _relevance: search
          ? {
              fields: ["title"],
              search: search.trim().split(" ").join(" & "),
              sort: "asc",
            }
          : undefined,
      },
      { price: sort === "price" ? order : undefined },
      { createdAt: sort === "date" ? order : undefined },
    ],
    where: {
      categoryPath: paths.length > 0 ? { in: paths } : undefined,
      title: search
        ? { search: search.trim().split(" ").join(" & ") }
        : undefined,
      price: price
        ? { gte: +price.split("-")[0]!, lte: +price.split("-")[1]! }
        : undefined,
      governorate: govId ? { id: +govId } : undefined,
      city: cityId ? { id: +cityId } : undefined,
    },
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
  });

  const totalAdsPromise = db.ad.count();

  const [ads, totalAds] = await Promise.all([adsPromise, totalAdsPromise]);
  const totalPages = Math.ceil(totalAds / pageSize);

  return NextResponse.json({ ads, totalAds, totalPages });
}

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

function getTreeFromPath(path: string): CategoryTreeItem[] {
  const segments = path.split("/");
  let tree = categoriesTree;
  for (const segment of segments) {
    tree = tree.find((c) => toPathFormat(c.name_en) == segment)!
      .categories as CategoryTreeItem[];
  }
  return tree;
}
