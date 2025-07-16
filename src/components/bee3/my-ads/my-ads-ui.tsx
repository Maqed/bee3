"use client";

import React from "react";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdCard from "@/components/bee3/ad-card";
import AdCardPlaceholder from "@/components/placeholders/ad-card-placeholder";
import SellButton from "@/components/bee3/sell-button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

// Define the ad type based on API response
type MyAd = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  negotiable: boolean;
  adStatus: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  categoryPath: string;
  images: {
    url: string;
  }[];
};

interface MyAdsResponse {
  ads: MyAd[];
}

// Status filter options
const STATUS_FILTERS = [
  { value: "ALL", key: "all" },
  { value: "PENDING", key: "pending" },
  { value: "ACCEPTED", key: "accepted" },
  { value: "REJECTED", key: "rejected" },
] as const;

function useMyAds(status: string = "ALL") {
  const { data: session } = authClient.useSession();
  return useQuery<MyAdsResponse, Error>({
    queryKey: ["my-ads", status, session?.user.id],
    queryFn: async () => {
      const url =
        status === "ALL"
          ? "/api/bee3/my-ads"
          : `/api/bee3/my-ads?status=${status}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch ads");
      }

      return response.json();
    },
    enabled: !!session?.user.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function MyAdsUI() {
  const t = useTranslations("/my-ads");
  const tAdmin = useTranslations("Admin.Ads");
  const [selectedStatus, setSelectedStatus] = useQueryState("status", {
    defaultValue: "ALL",
    history: "push",
  });

  const { data, isFetching, isLoading, isPending, error } =
    useMyAds(selectedStatus);

  // Get badge variant based on selection
  const getBadgeVariant = (status: string) => {
    return selectedStatus === status ? "default" : "outline";
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="font-medium text-red-600">{t("error.title")}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : t("error.description")}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ads = data?.ads || [];
  const displayAds =
    selectedStatus === "ALL"
      ? ads
      : ads.filter((ad) => ad.adStatus === selectedStatus);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <p className="text-muted-foreground">{t("description")}</p>
        </CardHeader>
        <CardContent>
          {/* Status filter badges */}
          <div className="mb-6 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                className="rounded-full"
                onClick={() => setSelectedStatus(filter.value)}
              >
                <Badge
                  size="lg"
                  variant={getBadgeVariant(filter.value)}
                  className={cn("cursor-pointer")}
                >
                  {t(`status.${filter.key}`)}
                </Badge>
              </button>
            ))}
          </div>
          {(isLoading || isPending || isFetching) && (
            <>
              {/* Ads grid skeleton */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <AdCardPlaceholder
                    cardClassName="w-full md:w-full lg:w-full"
                    key={index}
                  />
                ))}
              </div>
            </>
          )}
          {/* Ads display */}
          {displayAds.length === 0 &&
          !(isLoading || isPending || isFetching) ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <div className="text-lg font-medium text-muted-foreground">
                {t("empty.title")}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedStatus === "ALL"
                  ? t("empty.description.all")
                  : t("empty.description.filtered", {
                      status: t(
                        `status.${STATUS_FILTERS.find((f) => f.value === selectedStatus)?.key}`,
                      ),
                    })}
              </div>
              {selectedStatus === "ALL" && (
                <div>
                  <SellButton />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayAds.map((ad) => (
                <div key={ad.id} className="relative">
                  <AdCard
                    ad={ad as any}
                    containerClassName="w-full md:w-full lg:w-full"
                    cardClassName="w-full md:w-full lg:w-full"
                  />
                  {/* Status badge overlay */}
                  <div className="absolute right-2 top-2 z-10">
                    <Badge
                      variant={
                        ad.adStatus === "ACCEPTED"
                          ? "success"
                          : ad.adStatus === "REJECTED"
                            ? "destructive"
                            : "warning"
                      }
                      className="shadow-md"
                    >
                      {tAdmin(`table.badges.${ad.adStatus.toLowerCase()}`)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MyAdsUI;
