import { Suspense } from "react";
import AdsCategoriesCarousels from "../_components/ads-categories-carousels";
import AdsCarouselPlaceholder from "@/components/placeholders/ads-carousel-placeholder";
import { categoriesTree } from "@/schema/categories-tree";

export default function HomePage() {
  return (
    <Suspense
      fallback={[...Array(categoriesTree.length)].map((index) => (
        <AdsCarouselPlaceholder key={`ads-carousel-placeholder-${index}`} />
      ))}
    >
      <AdsCategoriesCarousels />
    </Suspense>
  );
}
