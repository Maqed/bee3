import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { categoriesTree } from "@/schema/categories-tree";
import { toPathFormat, getSubCategoryPaths } from "@/lib/category";
import { NUMBER_OF_ADS_IN_CAROUSEL } from "@/consts/ad";

export async function GET(request: NextRequest) {
  try {
    // Get all first-level category paths
    const firstLevelCategories = categoriesTree.map((category) => ({
      name: category.name,
      path: toPathFormat(category.name),
    }));

    // Build a single query to get ads for all first-level categories
    const categoryPaths = firstLevelCategories.map((cat) => cat.path);

    // Get all subcategory paths for each first-level category
    const allCategoryPaths = categoryPaths.flatMap((categoryPath) => {
      const subPaths = getSubCategoryPaths(categoryPath);
      return [categoryPath, ...subPaths];
    });

    // Single query to get ads for all categories with proper grouping
    const adsByCategory = await db.ad.findMany({
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
    });

    // Group ads by their first-level category
    const groupedAds = firstLevelCategories.map((category) => {
      const categoryAds = adsByCategory
        .filter((ad) => {
          // Check if ad belongs to this category or its subcategories
          const adCategoryPath = ad.categoryPath;
          return (
            adCategoryPath === category.path ||
            adCategoryPath.startsWith(category.path + "/")
          );
        })
        .slice(0, NUMBER_OF_ADS_IN_CAROUSEL);

      return {
        categoryName: category.name,
        categoryPath: category.path,
        ads: categoryAds,
      };
    });

    return NextResponse.json({ categories: groupedAds });
  } catch (error) {
    console.error("Error fetching home page carousel data:", error);
    return NextResponse.json(
      { error: "Failed to fetch carousel data" },
      { status: 500 },
    );
  }
}
