import React from "react";
import { getServerSideFullCategory } from "@/lib/server-side";
import AdsCarousel from "@/components/bee3/ads-carousel";
import { absoluteURL, toPathFormat } from "@/lib/utils";
import { categoriesTree } from "@/schema/categories-tree";
import { NUMBER_OF_ADS_IN_CAROUSEL } from "@/consts/ad";

export async function fetchCategoryCarousel(categoryPath: string) {
  const adsResponse = await fetch(
    absoluteURL(
      `/api/bee3/search?category=${categoryPath}&pageSize=${NUMBER_OF_ADS_IN_CAROUSEL}`,
    ),
    {
      method: "GET",
    },
  );

  const { ads } = await adsResponse.json();
  return ads;
}

async function AdsCategoriesCarousels() {
  const categoriesData = await Promise.all(
    categoriesTree.map(async (category) => {
      const categoryPathName = toPathFormat(category.name);
      const categoryURL = `/${categoryPathName}`;
      const categoryAds = await fetchCategoryCarousel(categoryPathName);
      return {
        categoryAds,
        categoryURL,
        title: await getServerSideFullCategory(categoryPathName),
      };
    }),
  );

  return (
    <>
      {categoriesData.map(({ categoryAds, categoryURL, title }) => (
        <AdsCarousel
          ads={categoryAds}
          title={title}
          showMoreHref={categoryURL}
        />
      ))}
    </>
  );
}

export default AdsCategoriesCarousels;
