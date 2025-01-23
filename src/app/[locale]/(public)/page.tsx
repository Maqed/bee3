import { Suspense } from "react";
import AdsCategoriesCarousels from "./_components/ads-categories-carousels";
import ExploreCategories from "./_components/explore-categories";
import SellButton from "@/components/bee3/sell-button";
import AdsCarouselPlaceholder from "@/components/placeholders/ads-carousel-placeholder";

export default async function HomePage() {
  return (
    <main className="flex flex-col gap-y-5">
      <ExploreCategories />
      {/* TODO: Change the Array length to the actual number of carousel in prod  */}
      <Suspense
        fallback={[...Array(2)].map(() => (
          <AdsCarouselPlaceholder />
        ))}
      >
        <AdsCategoriesCarousels />
      </Suspense>

      <SellButton className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden" />
    </main>
  );
}
