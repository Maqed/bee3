"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AdCardPlaceholder from "./ad-card-placeholder";

export function AdImagesPlaceholder() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[450px] w-full" />
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max gap-x-2 p-1 pb-3">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-[100px] w-[100px]" />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

export function PriceAndTitlePlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-6 w-6" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex w-1/3 items-center">
            <MapPin className="me-2 inline-flex animate-pulse text-muted-foreground" />
            <Skeleton className="h-5 w-full" />
          </div>
          <Skeleton className="h-5 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DescriptionPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-1/4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}

export function UserInformationPlaceholder({
  variant = "desktop",
}: {
  variant?: "mobile" | "desktop";
}) {
  if (variant === "mobile") {
    return (
      <Card className="md:hidden">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-1/2" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function RelatedAdsPlaceholder() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-1/4" />
      <Carousel className="w-full max-w-full">
        <CarouselContent>
          {[...Array(4)].map((_, index) => (
            <CarouselItem key={`ad-card-placeholder-${index}`}>
              <Card>
                <CardContent className="p-4">
                  <AdCardPlaceholder />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
