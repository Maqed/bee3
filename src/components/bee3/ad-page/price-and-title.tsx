import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import FavoritesHeart from "@/components/bee3/favorites-heart";
import {
  getLocalizedLocation,
  getLocalizedTimeAgo,
  getLocalizedPrice,
} from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";

type PriceAndTitleProps = {
  ad: AdWithUser;
  locale: string;
};

export function PriceAndTitle({ ad, locale }: PriceAndTitleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-3xl text-primary md:text-5xl">
          {getLocalizedPrice(locale, ad.price)}
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
