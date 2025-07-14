import React from "react";
import { getCategoryTranslations } from "@/lib/category-asynchronous";
import AdsCarousel from "@/components/bee3/ads-carousel";
import { db } from "@/server/db";
import { getSubCategoryPaths, getFirstLevelCategories } from "@/lib/category";
import { NUMBER_OF_ADS_IN_CAROUSEL } from "@/consts/ad";
import { Ad } from "@/types/bee3";
import { getNonDeletedAds } from "@/database/ad";

// Type for carousel ads that matches what we query from database
type CarouselAd = Omit<Ad, "images"> & {
  images: { url: string }[];
};

async function AdsCategoriesCarousels() {
  try {
    // Get all first-level category paths
    const firstLevelCategories = getFirstLevelCategories();

    // Query ads for each category separately to limit results at database level
    const categories = await Promise.all(
      firstLevelCategories.map(async (category) => {
        // Get all subcategory paths for this category
        const subPaths = getSubCategoryPaths(category.path);
        const allCategoryPaths = [category.path, ...subPaths];

        // Query only the required number of ads for this category
        const categoryAds = await getNonDeletedAds({
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
          ads: categoryAds as CarouselAd[],
        };
      }),
    );
    const { getAsynchronousFullCategory } = await getCategoryTranslations();

    // Get category titles for each category
    const categoriesData = await Promise.all(
      categories.map(async (categoryData) => {
        const title = await getAsynchronousFullCategory(
          categoryData.categoryPath,
        );
        return {
          categoryAds: categoryData.ads,
          categoryURL: `/${categoryData.categoryPath}`,
          title,
        };
      }),
    );

    return (
      <>
        {categoriesData.map(({ categoryAds, categoryURL, title }) => (
          <AdsCarousel
            key={categoryURL}
            ads={categoryAds as Ad[]}
            title={title}
            showMoreHref={categoryURL}
          />
        ))}
      </>
    );
  } catch (error) {
    console.error("Error fetching home page carousel data:", error);
    return null;
  }
}

export default AdsCategoriesCarousels;
