import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { categoriesTree, CategoryTreeItem } from "@/schema/categories-tree";
import { Prisma } from "@prisma/client";

const DEFAULT_PAGE_SIZE = 12;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 64;

export async function GET(request: NextRequest) {
  const categoryPath = request.nextUrl.searchParams.get("category");

  const search = request.nextUrl.searchParams.get("q");
  if (!categoryPath && !search)
    return NextResponse.json({ error: "invalid-query" }, { status: 400 });

  const pageNum = +(request.nextUrl.searchParams.get("page") ?? 0);
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

  const paths = categoryPath
    ? [categoryPath].concat(getSubCategoryPaths(categoryPath))
    : [];

  const adsPromise = db.ad.findMany({
    orderBy: [
      {
        _relevance: search
          ? {
              fields: ["title"],
              search: search,
              sort: "asc",
            }
          : undefined,
      },
      { price: sort === "price" ? order : undefined },
      { createdAt: sort === "date" ? order : undefined },
    ],
    where: {
      categoryPath: paths.length > 0 ? { in: paths } : undefined,
      title: search ? { search: search } : undefined,
      price: price
        ? { gte: +price.split("-")[0]!, lte: +price.split("-")[1]! }
        : undefined,
    },
    skip: pageNum * pageSize,
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
      const subPath = `${rootPath}/${subTree.name}`;
      subPaths.push(subPath);
      subPaths.push(...getSubCategoryPaths(subPath));
    }
  }

  return subPaths;
}

function getTreeFromPath(path: string): CategoryTreeItem[] {
  const segments = path.split("/");
  let tree = categoriesTree.categories as CategoryTreeItem[];
  for (const segment of segments) {
    tree = tree.find((c) => c.name == segment)!
      .categories as CategoryTreeItem[];
  }
  return tree;
}
