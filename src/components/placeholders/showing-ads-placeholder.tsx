import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import AdCardPlaceholder from "./ad-card-placeholder";

export function ShowingAdsPagePlaceholder() {
  return (
    <main className="container">
      {/* Title placeholder */}
      <div className="mb-5">
        <Skeleton className="h-8 w-80 lg:h-10 lg:w-96" />
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Filter section */}
        <div className="lg:col-span-3">
          {/* Mobile filter button */}
          <div className="mb-3 lg:hidden">
            <Button disabled variant="outline" className="w-full">
              <Filter className="me-2 h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </Button>
          </div>

          {/* Desktop filter card */}
          <Card className="hidden lg:block">
            <CardContent className="space-y-4 p-4">
              {/* Filter sections placeholders */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>
              <Button disabled className="w-full">
                <Skeleton className="h-4 w-16" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Ads section */}
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-9">
          {/* Sort and view options placeholder */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>

          {/* Ads grid placeholder */}
          <div className="space-y-3">
            {[...Array(8)].map((_, index) => (
              <AdCardPlaceholder key={index} orientation="horizontal" />
            ))}
          </div>

          {/* Pagination placeholder */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ShowingAdsPagePlaceholder;
