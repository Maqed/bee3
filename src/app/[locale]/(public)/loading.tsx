import HomePageLayout from "@/components/bee3/home-page-layout";
import AdsCarouselPlaceholder from "@/components/placeholders/ads-carousel-placeholder";
import { categoriesTree } from "@/schema/categories-tree";
import React from "react";

function HomePageLoading() {
  return (
    <HomePageLayout>
      {[...Array(categoriesTree.length)].map(() => (
        <AdsCarouselPlaceholder />
      ))}
    </HomePageLayout>
  );
}

export default HomePageLoading;
