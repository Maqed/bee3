import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import FavoritesHeart from "@/components/bee3/favorites-heart";
import {
  getLocalizedLocation,
  getLocalizedTimeAgo,
  getLocalizedPrice,
} from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

type PriceAndTitleProps = {
  ad: AdWithUser;
  locale: string;
};

export function PriceAndTitle({ ad, locale }: PriceAndTitleProps) {
  const tAd = useTranslations("/ad/[adId]");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-3xl text-primary md:text-5xl">
          <span className="flex items-center justify-center gap-3">
            {getLocalizedPrice(locale, ad.price)}{" "}
            <Badge className="px-3 py-1 text-xl" variant="secondary">
              {tAd("negotiable")}
            </Badge>
          </span>
          <FavoritesHeart className="size-6" adId={ad.id} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h1 className="mb-1 text-xl md:text-2xl">{ad.title}</h1>
        <div className="flex items-center justify-between text-sm">
          <h3 className="flex items-center">
            <MapPin className="me-2 inline" />
            {getLocalizedLocation(locale, ad.cityId)}
          </h3>
          <p>{getLocalizedTimeAgo(locale, ad.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
