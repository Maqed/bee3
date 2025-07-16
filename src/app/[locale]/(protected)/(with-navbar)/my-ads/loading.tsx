import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdCardPlaceholder from "@/components/placeholders/ad-card-placeholder";
import { cn } from "@/lib/utils";

// Status filter options (copying from MyAdsUI)
const STATUS_FILTERS = [
  { value: "ALL", key: "all" },
  { value: "PENDING", key: "pending" },
  { value: "ACCEPTED", key: "accepted" },
  { value: "REJECTED", key: "rejected" },
] as const;

function MyAdsLoading() {
  const t = useTranslations("/my-ads");

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <p className="text-muted-foreground">{t("description")}</p>
        </CardHeader>
        <CardContent>
          {/* Status filter badges skeleton */}
          <div className="mb-6 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Badge
                key={filter.value}
                size="lg"
                variant="outline"
                className={cn("h-7 w-20 animate-pulse bg-muted")}
              >
                <span className="invisible">placeholder</span>
                <span className="sr-only">Loading badge</span>
              </Badge>
            ))}
          </div>
          {/* Ads grid skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <AdCardPlaceholder
                cardClassName="w-full md:w-full lg:w-full"
                key={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MyAdsLoading;
