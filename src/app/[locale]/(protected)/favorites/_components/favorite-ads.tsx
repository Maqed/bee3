"use client";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { useFavoriteAds } from "@/hooks/useFavAds";
import AdCard from "@/components/bee3/ad-card";
import AdCardPlaceholder from "@/components/placeholders/ad-card-placeholder";

export function FavoriteAds() {
  const t = useTranslations("/favorites");
  const { data, isFetching, isLoading, isPending, error } = useFavoriteAds();

  if (isFetching || isLoading || isPending) {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-3">
        {[...Array(4)].map(() => (
          <AdCardPlaceholder />
        ))}
      </div>
    );
  }

  if (!data?.favoriteAds || data.favoriteAds.length === 0 || error) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Heart className="mb-2 size-16 text-primary" strokeWidth={1.5} />
        <p className="mb-2 text-lg font-semibold">
          {t("no-favorites.message")}
        </p>
        <p className="text-muted-foreground">{t("no-favorites.hint")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 px-3">
      {data.favoriteAds.map((ad) => (
        <AdCard key={ad.id} ad={ad} orientation="vertical" />
      ))}
    </div>
  );
}
