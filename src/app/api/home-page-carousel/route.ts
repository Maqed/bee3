import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { getSubCategoryPaths, getFirstLevelCategories } from "@/lib/category";
import { NUMBER_OF_ADS_IN_CAROUSEL } from "@/consts/ad";

export async function GET(request: NextRequest) {
  try {
    // Get all first-level category paths
    const firstLevelCategories = getFirstLevelCategories();

    // Query ads for each category separately to limit results at database level
    const groupedAds = await Promise.all(
      firstLevelCategories.map(async (category) => {
        // Get all subcategory paths for this category
        const subPaths = getSubCategoryPaths(category.path);
        const allCategoryPaths = [category.path, ...subPaths];

        // Query only the required number of ads for this category
        const categoryAds = await db.ad.findMany({
          where: {
            categoryPath: {
              in: allCategoryPaths,
            },
          },
          include: {
            images: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: NUMBER_OF_ADS_IN_CAROUSEL,
        });

        return {
          categoryName: category.name,
          categoryPath: category.path,
          ads: categoryAds,
        };
      }),
    );

    return NextResponse.json({ categories: groupedAds });
  } catch (error) {
    console.error("Error fetching home page carousel data:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel data" },
      { status: 500 },
    );
  }
}
