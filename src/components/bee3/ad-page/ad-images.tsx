"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { generateImagePlaceholder } from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";

type AdImagesProps = {
  ad: AdWithUser;
};

export function AdImages({ ad }: AdImagesProps) {
  const [api, setApi] = useState<CarouselApi>();

  if (ad.images.length > 1) {
    return (
      <div>
        <Carousel setApi={setApi}>
          <CarouselContent className="mb-3">
            {ad.images.map((imageURL, index) => (
              <CarouselItem
                key={`carousel-item-${imageURL}-${index}`}
                className="flex min-w-0 shrink-0 grow-0 basis-full items-center justify-center"
              >
                <Image
                  priority={index === 0 || index === 1}
                  width={1500}
                  height={450}
                  src={imageURL.url || "/placeholder.svg"}
                  placeholder={generateImagePlaceholder(1500, 450)}
                  className="h-auto max-h-[450px] w-full object-contain"
                  alt={ad.title}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="start-0 h-full w-10 rounded-none border-none bg-transparent hover:bg-transparent"
            arrowClassName="size-6 md:size-10"
          />
          <CarouselNext
            className="end-0 h-full w-10 rounded-none border-none bg-transparent hover:bg-transparent"
            arrowClassName="size-6 md:size-10"
          />
        </Carousel>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max gap-x-2 px-2 py-3">
            {ad.images.map((imageURL, index) => (
              <button
                key={`thumbnail-${imageURL}-${index}`}
                className="inline hover:outline hover:outline-2 hover:outline-primary focus:outline focus:outline-2 focus:outline-primary"
                onClick={() => api?.scrollTo(index)}
              >
                <Image
                  width={100}
                  height={100}
                  src={imageURL.url || "/placeholder.svg"}
                  placeholder={generateImagePlaceholder(100, 100)}
                  className="h-auto max-h-[100px] w-full object-contain"
                  alt={ad.title}
                />
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  return (
    <Image
      priority
      width={1500}
      height={450}
      placeholder={generateImagePlaceholder(1500, 450)}
      src={ad.images[0]?.url! || "/placeholder.svg"}
      className="h-auto max-h-[450px] w-full object-contain"
      alt={ad.title}
    />
  );
}
