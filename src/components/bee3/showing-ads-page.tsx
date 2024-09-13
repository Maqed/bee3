import { getServerSideFullCategory } from "@/lib/server-side";
import AdCard from "./ad-card";
import { notFound } from "next/navigation";
import { Ad } from "@prisma/client";
import FilterAds from "./filter-ads";
import AdFilterDialog from "./ad-filter-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationWithLinks } from "../ui/pagination-with-links";
import { DEFAULT_PAGE_SIZE } from "@/app/api/bee3/search/route";
import { absoluteURL } from "@/lib/utils";

type Props = {
  categoryPath?: string;
  searchParams: Record<string, string | undefined>;
};

async function ShowingAdsPage({ categoryPath, searchParams }: Props) {
  let params = new URLSearchParams();
  if (categoryPath) params = new URLSearchParams({ category: categoryPath });

  // Add non-empty search params to the URLSearchParams object
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const categoryResponse = await fetch(
    absoluteURL(`/api/bee3/search?${params.toString()}`),
    { method: "GET" },
  );

  if (categoryResponse.status !== 200) {
    notFound();
  }

  const { ads, totalPages }: { ads: Ad[]; totalPages: number } =
    await categoryResponse.json();

  let title = categoryPath
    ? getServerSideFullCategory(categoryPath)
    : params.get("q")
      ? params.get("q")
      : "";
  return (
    <main className="container">
      <h1 className="mb-5 text-2xl lg:text-3xl">{title}</h1>
      <div className="grid grid-cols-12 gap-3">
        {/* Filter */}
        <div className="lg:col-span-3">
          {/* Mobile */}
          <AdFilterDialog />
          {/* Desktop */}
          <Card className="hidden lg:block">
            <CardContent className="p-4">
              <FilterAds />
            </CardContent>
          </Card>
        </div>
        {/* Ads */}
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-9">
          {ads.map((ad) => {
            return <AdCard key={ad.id} orientation="horizontal" ad={ad} />;
          })}
          <PaginationWithLinks
            totalPageCount={totalPages}
            page={Number(params.get("page")) ?? 1}
            pageSize={DEFAULT_PAGE_SIZE}
          />
        </div>
      </div>
    </main>
  );
}

export default ShowingAdsPage;
