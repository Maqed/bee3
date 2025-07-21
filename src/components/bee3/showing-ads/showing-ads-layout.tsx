import { ReactNode } from "react";
import FilterAds from "./filter-ads";
import AdFilterDialog from "./ad-filter-dialog";
import { Card, CardContent } from "@/components/ui/card";
import ShowingAdsBreadcrumb from "./showing-ads-breadcrumb";
import ShowingAdsTitle from "./showing-ads-title";

type Props = {
  categoryPath?: string[];
  children: ReactNode;
};

function ShowingAdsLayout({ children, categoryPath }: Props) {
  return (
    <main className="container">
      <ShowingAdsBreadcrumb categoryPath={categoryPath} />
      <ShowingAdsTitle categoryPath={categoryPath} />
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
          {children}
        </div>
      </div>
    </main>
  );
}

export default ShowingAdsLayout;
