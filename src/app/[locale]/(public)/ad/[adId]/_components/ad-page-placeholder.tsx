import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AdsCarouselPlaceholder from "@/components/placeholders/ads-carousel-placeholder";

function AdPagePlaceholder() {
  return (
    <>
      {/* Ad Information */}
      <div className="col-span-12 flex flex-col gap-y-5 md:col-span-8">
        <Skeleton className="h-[450px] w-full" />
        <div className="flex flex-col gap-y-5 max-md:container">
          {/* Price and Title */}
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
                  <MapPin className="me-2 inline-flex animate-pulse text-muted" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <Skeleton className="h-5 w-1/4" />
              </div>
            </CardContent>
          </Card>
          {/* Description */}
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
          <Separator />
          {/* Related Ads */}
          <AdsCarouselPlaceholder />
        </div>
      </div>
      {/* User Information */}
      <div className="hidden md:col-span-4 md:block">
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
          <CardFooter className="flex flex-col gap-y-3 *:w-full">
            <Button disabled>
              <Phone className="me-1" /> <Skeleton className="h-4 w-24" />
            </Button>
            <Button disabled>
              <MessageCircle className="me-1" />{" "}
              <Skeleton className="h-4 w-24" />
            </Button>
            <Button disabled variant="whatsapp">
              <MessageCircle className="me-1" />{" "}
              <Skeleton className="h-4 w-24" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default AdPagePlaceholder;
