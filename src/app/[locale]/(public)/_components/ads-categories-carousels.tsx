import React from "react";
import { getServerSideFullCategory } from "@/lib/server-side";
import AdsCarousel from "@/components/bee3/ads-carousel";
import { absoluteURL } from "@/lib/utils";

async function AdsCategoriesCarousels() {
  const response = await fetch(absoluteURL("/api/home-page-carousel"), {
    method: "GET",
  });

  if (!response.ok) {
    console.error("Failed to fetch carousel data");
    return null;
  }

  const { categories } = await response.json();

  // Get category titles for each category
  const categoriesData = await Promise.all(
    categories.map(async (categoryData: any) => {
      const title = await getServerSideFullCategory(categoryData.categoryPath);
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
          ads={categoryAds}
          title={title}
          showMoreHref={categoryURL}
        />
      ))}
    </>
  );
}

export default AdsCategoriesCarousels;
