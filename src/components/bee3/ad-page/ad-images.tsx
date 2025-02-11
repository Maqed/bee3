"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDot,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { generateImagePlaceholder } from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";

type AdImagesProps = {
  ad: AdWithUser;
};

export function AdImages({ ad }: AdImagesProps) {
  if (ad.images.length > 1) {
    return (
      <Carousel>
        <CarouselContent className="mb-3">
          {ad.images.map((imageURL, index) => (
            <CarouselItem
              key={`carousel-item-${imageURL}`}
              className="min-w-0 shrink-0 grow-0 basis-full"
            >
              <Image
                priority={index === 0 || index === 1}
                width={1500}
                height={450}
                src={imageURL || "/placeholder.svg"}
                placeholder={generateImagePlaceholder(1500, 450)}
                className="h-auto max-h-[450px] w-full object-contain"
                alt={ad.title}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max gap-x-2 p-1 pb-3">
            {ad.images.map((imageURL, index) => (
              <CarouselDot
                className="inline hover:outline hover:outline-2 hover:outline-primary"
                key={`carousel-dot-${imageURL}`}
                index={index}
              >
                <Image
                  width={100}
                  height={100}
                  src={imageURL || "/placeholder.svg"}
                  placeholder={generateImagePlaceholder(100, 100)}
                  className="h-auto max-h-[100px] w-full object-contain"
                  alt={ad.title}
                />
              </CarouselDot>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Carousel>
    );
  }

  return (
    <Image
      priority
      width={1500}
      height={450}
      placeholder={generateImagePlaceholder(1500, 450)}
      src={ad.images[0]! || "/placeholder.svg"}
      className="h-auto max-h-[450px] w-full object-contain"
      alt={ad.title}
    />
  );
}
