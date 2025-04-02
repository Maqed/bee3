import { getServerSideFullCategory } from "@/lib/server-side";
import FilterAds from "./filter-ads";
import AdFilterDialog from "./ad-filter-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getURLSearchParamsFromPageParams } from "@/lib/utils";
import ShowingAds from "./showing-ads";
import { Suspense } from "react";
import AdCardPlaceholder from "@/components/placeholders/ad-card-placeholder";
import { getTranslations } from "next-intl/server";

type Props = {
  categoryPath?: string[];
  searchParams: Record<string, string | undefined>;
};

async function ShowingAdsPage({ categoryPath, searchParams }: Props) {
  let params = getURLSearchParamsFromPageParams(searchParams);
  const tShowingAdsPage = await getTranslations("showing-ads-page");
  if (categoryPath) params.set("category", categoryPath.join("/"));

  let title = categoryPath
    ? await getServerSideFullCategory(categoryPath.join("/"))
    : params.get("q")
      ? params.get("q")
      : "";

  return (
    <main className="container">
      <h1 className="mb-5 text-2xl font-bold lg:text-3xl">
        {tShowingAdsPage("showing-ads-for", {
          title,
        })}
      </h1>
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
          <Suspense
            fallback={[...Array(12)].map(() => (
              <AdCardPlaceholder orientation="horizontal" />
            ))}
          >
            <ShowingAds params={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default ShowingAdsPage;
