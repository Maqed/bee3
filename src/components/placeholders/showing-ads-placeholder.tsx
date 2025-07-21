import { Skeleton } from "@/components/ui/skeleton";
import AdCardPlaceholder from "./ad-card-placeholder";

export function ShowingAdsPagePlaceholder() {
  return (
    <div className="col-span-12 flex flex-col gap-3 lg:col-span-9">
      {/* Ads grid placeholder */}
      <div className="space-y-3">
        {[...Array(8)].map((_, index) => (
          <AdCardPlaceholder key={index} orientation="horizontal" />
        ))}
      </div>

      {/* Pagination placeholder */}
      <nav className="mx-auto mt-6 flex w-full justify-center">
        <ul className="flex flex-row items-center gap-1">
          {/* Previous button placeholder */}
          <Skeleton className="h-9 w-20" />

          {/* Page number buttons placeholder */}

          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />

          <Skeleton className="h-9 w-9" />

          {/* Next button placeholder */}
          <Skeleton className="h-9 w-20" />
        </ul>
      </nav>
    </div>
  );
}

export default ShowingAdsPagePlaceholder;
