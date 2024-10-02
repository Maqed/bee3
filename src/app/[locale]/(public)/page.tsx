import AdsCategoriesCarousels from "./_components/ads-categories-carousels";
import ExploreCategories from "./_components/explore-categories";

import SellButton from "@/components/bee3/sell-button";

export default async function HomePage() {
  return (
    <main className="flex flex-col gap-y-5">
      <ExploreCategories />
      <AdsCategoriesCarousels />
      <SellButton className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden" />
    </main>
  );
}
