import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { categoriesTree, CategoryTreeItem } from "@/schema/categories-tree";
import { Prisma } from "@prisma/client";

export const DEFAULT_PAGE_SIZE = 12;
export const MIN_PAGE_SIZE = 1;
export const MAX_PAGE_SIZE = 64;
/**
 * Toggle visibility of a content tab
 * category ----> get the category of the ads
 * page ----> get the page number (used in pagination)
 * pageSize ----> number of ads to be fetched
 * q ----> search query
 * price ----> price range of the ads, written in this format (min-max) ex: (20-40000)
 * sort ----> sorting by what? only accepts (price, date)
 * order ----> order of the ads, by default it's descending
 */
export async function GET(request: NextRequest) {
    const categoryId = +(request.nextUrl.searchParams.get("category") ?? 0);

    const search = request.nextUrl.searchParams.get("q");
    if (!categoryId && !search)
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

    const Ids = getCategoryChildrenIds(categoryId, categoriesTree);

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
            categoryId: Ids.length > 0 ? { in: Ids } : undefined,
            title: search ? { search: search } : undefined,
            price: price
                ? { gte: +price.split("-")[0]!, lte: +price.split("-")[1]! }
                : undefined,
        },
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
    });

    const totalAdsPromise = db.ad.count();

    const [ads, totalAds] = await Promise.all([adsPromise, totalAdsPromise]);
    const totalPages = Math.ceil(totalAds / pageSize);

    return NextResponse.json({ ads, totalAds, totalPages });
}

function getCategoryChildrenIds(categoryId: number, categoriesTree: CategoryTreeItem[]): number[] {
    // Helper function to collect all nested children IDs
    const collectChildrenIds = (category: CategoryTreeItem): number[] => {
        const children = category.categories || [];
        return [
            ...children.map(child => child.id),
            ...children.flatMap(child => collectChildrenIds(child))
        ];
    };

    // Find target category and collect children IDs
    const findAndCollectIds = (categories: CategoryTreeItem[]): number[] => {
        for (const category of categories) {
            if (category.id === categoryId) return collectChildrenIds(category);
            if (category.categories) {
                const result = findAndCollectIds(category.categories);
                if (result.length > 0) return result;
            }
        }
        return [];
    };

    return findAndCollectIds(categoriesTree);
}