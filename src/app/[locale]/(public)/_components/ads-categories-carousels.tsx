import React from "react";
import { getServerSideFullCategory } from "@/lib/server-side";
import AdsCarousel from "@/components/bee3/ads-carousel";
import { absoluteURL } from "@/lib/utils";
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
  const vehiclesAds = await fetchCategoryCarousel("vehicles");
  const mobilesAndTabletsAds = await fetchCategoryCarousel(
    "mobiles-and-tablets",
  );
  return (
    <>
      <AdsCarousel
        ads={vehiclesAds}
        title={await getServerSideFullCategory("vehicles")}
        showMoreHref="/vehicles"
      />
      <AdsCarousel
        ads={mobilesAndTabletsAds}
        title={await getServerSideFullCategory("mobiles-and-tablets")}
        showMoreHref="/mobiles-and-tablets"
      />
    </>
  );
}

export default AdsCategoriesCarousels;
