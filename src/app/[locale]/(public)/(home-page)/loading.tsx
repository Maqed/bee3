import AdsCarouselPlaceholder from "@/components/placeholders/ads-carousel-placeholder";
import { categoriesTree } from "@/schema/categories-tree";

export default function HomePageLoading() {
  return [...Array(categoriesTree.length)].map((index) => (
    <AdsCarouselPlaceholder key={`ads-carousel-placeholder-${index}`} />
  ));
}
