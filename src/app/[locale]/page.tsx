import ExploreCategories from "./_components/explore-categories";
import AdsCarousel from "./_components/ads-carousel";
import SellButton from "@/components/bee3/sell-button";
export default function HomePage() {
  return (
    <main>
      <ExploreCategories />
      <AdsCarousel />
      <SellButton className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden" />
    </main>
  );
}
