"use client";

import React, { useState } from "react";
import { useQueryState } from "nuqs";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AdCard from "@/components/bee3/ad-card";
import AdCardPlaceholder from "@/components/placeholders/ad-card-placeholder";
import SellButton from "@/components/bee3/sell-button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { EllipsisVerticalIcon, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

function useDeleteAd() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  return useMutation({
    mutationFn: async (adId: string) => {
      const response = await fetch(`/api/bee3/ad/${adId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ad");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all my-ads queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["my-ads"],
      });
    },
  });
}

function MyAdsUI() {
  const t = useTranslations("/my-ads");
  const tAdmin = useTranslations("Admin.Ads");
  const [selectedStatus, setSelectedStatus] = useQueryState("status", {
    defaultValue: "ALL",
    history: "push",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const { data, isFetching, isLoading, isPending, error } =
    useMyAds(selectedStatus);

  const deleteAdMutation = useDeleteAd();

  const handleDeleteAd = async (adId: string) => {
    try {
      await deleteAdMutation.mutateAsync(adId);
      toast({
        title: t("toast.delete-success"),
        variant: "success",
      });
      setDeleteDialogOpen(null);
    } catch (error) {
      toast({
        title: t("toast.delete-error"),
        variant: "destructive",
      });
    }
  };

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
                  <div
                    className="absolute right-2 top-2 z-10 flex items-center justify-center gap-1"
                    dir="ltr"
                  >
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          className="size-7 rounded-md bg-background text-sm text-foreground"
                        >
                          <EllipsisVerticalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-0">
                        <DropdownMenuLabel>
                          {t("dropdown.manage-ad")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Dialog
                          open={deleteDialogOpen === ad.id}
                          onOpenChange={(open) =>
                            setDeleteDialogOpen(open ? ad.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setDeleteDialogOpen(ad.id);
                              }}
                              className="flex items-center gap-1 bg-destructive text-destructive-foreground focus:bg-destructive/90 focus:text-destructive-foreground"
                            >
                              <Trash2 className="size-4" />
                              {t("dropdown.delete")}
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {t("delete-dialog.title")}
                              </DialogTitle>
                              <DialogDescription>
                                {t("delete-dialog.description")}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(null)}
                                disabled={deleteAdMutation.isPending}
                              >
                                {t("delete-dialog.cancel")}
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteAd(ad.id)}
                                disabled={deleteAdMutation.isPending}
                              >
                                {deleteAdMutation.isPending
                                  ? t("delete-dialog.deleting")
                                  : t("delete-dialog.delete")}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <AdCard
                    ad={ad as any}
                    containerClassName="w-full md:w-full lg:w-full"
                    cardClassName="w-full md:w-full lg:w-full"
                  />
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
