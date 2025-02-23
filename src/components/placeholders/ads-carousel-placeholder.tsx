import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AdCardPlaceholder from "./ad-card-placeholder";
import { Skeleton } from "@/components/ui/skeleton";

function AdsCarouselPlaceholder() {
  return (
    <section className="container w-full">
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-7 w-32 md:w-64" />
        <Skeleton className="h-5 w-20 md:w-24" />
      </div>
      <Carousel opts={{ dragFree: true }} className="w-full max-w-full">
        <CarouselContent>
          {[...Array(4)].map((idx) => (
            <CarouselItem key={`ad-carousel-placeholder-${idx}`}>
              <AdCardPlaceholder orientation="vertical" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export default AdsCarouselPlaceholder;
