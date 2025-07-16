import ExploreCategories from "@/components/bee3/explore-categories";
import AdsCarouselPlaceholder from "@/components/placeholders/ads-carousel-placeholder";
import { categoriesTree } from "@/schema/categories-tree";

export default function HomePageLoading() {
  return (
    <main className="flex flex-col gap-y-5">
      <ExploreCategories />
      {[...Array(categoriesTree.length)].map((index) => (
        <AdsCarouselPlaceholder key={`ads-carousel-placeholder-${index}`} />
      ))}
    </main>
  );
}
