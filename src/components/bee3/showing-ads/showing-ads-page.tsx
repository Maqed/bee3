import { useCategoryTranslations } from "@/lib/category-synchronous";
import FilterAds from "./filter-ads";
import AdFilterDialog from "./ad-filter-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getURLSearchParamsFromPageParams } from "@/lib/utils";
import ShowingAds from "./showing-ads";
import { useTranslations } from "next-intl";

type Props = {
  categoryPath?: string[];
  searchParams: Record<string, string | undefined>;
};

function ShowingAdsPage({ categoryPath, searchParams }: Props) {
  let params = getURLSearchParamsFromPageParams(searchParams);
  const tShowingAdsPage = useTranslations("showing-ads-page");
  if (categoryPath) params.set("category", categoryPath.join("/"));
  const { getSynchronousFullCategory } = useCategoryTranslations();
  let title = categoryPath
    ? getSynchronousFullCategory(categoryPath.join("/"))
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
          <AdFilterDialog categoryPath={categoryPath} />
          {/* Desktop */}
          <Card className="hidden lg:block">
            <CardContent className="p-4">
              <FilterAds categoryPath={categoryPath} />
            </CardContent>
          </Card>
        </div>
        {/* Ads */}
        <div className="col-span-12 flex flex-col gap-3 lg:col-span-9">
          <ShowingAds params={params} />
        </div>
      </div>
    </main>
  );
}

export default ShowingAdsPage;
