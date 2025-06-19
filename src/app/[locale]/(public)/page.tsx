import { Suspense } from "react";
import AdsCategoriesCarousels from "./_components/ads-categories-carousels";
import ExploreCategories from "@/components/bee3/explore-categories";
import SellButton from "@/components/bee3/sell-button";
import AdsCarouselPlaceholder from "@/components/placeholders/ads-carousel-placeholder";
import { categoriesTree } from "@/schema/categories-tree";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-y-5">
      <ExploreCategories />
      <Suspense
        fallback={[...Array(categoriesTree.length)].map((index) => (
          <AdsCarouselPlaceholder key={`ads-carousel-placeholder-${index}`} />
        ))}
      >
        <AdsCategoriesCarousels />
      </Suspense>

      <SellButton className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden" />
    </main>
  );
}
