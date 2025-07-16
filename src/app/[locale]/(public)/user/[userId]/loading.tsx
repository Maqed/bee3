import { Skeleton } from "@/components/ui/skeleton";
import AdCardPlaceholder from "@/components/placeholders/ad-card-placeholder";

export default function UserPageLoading() {
  return (
    <main className="mx-auto w-full py-8 md:px-8 md:py-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="flex flex-col items-center gap-6 lg:col-span-3">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full md:h-32 md:w-32" />
            <div className="flex flex-row items-center gap-2 text-center md:text-left">
              <Skeleton className="h-8 w-32 md:h-10 md:w-48" />
            </div>
            <div className="flex w-full flex-col items-center space-y-2 text-center md:text-left">
              <Skeleton className="h-5 w-48 md:w-64" />
              <Skeleton className="h-4 w-40 md:w-56" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        {/* Advertises */}
        <div className="lg:col-span-9">
          <Skeleton className="mx-auto mb-4 h-8 w-40" />
          <div className="grid grid-cols-1 gap-4 px-3 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <AdCardPlaceholder
                key={idx}
                cardClassName="w-full md:w-full lg:w-full"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
