import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import FavoritesHeart from "@/components/bee3/favorites-heart";
import {
  getLocalizedLocation,
  getLocalizedTimeAgo,
  getLocalizedPrice,
  absoluteURL,
} from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import CopyToClipboardButton from "@/components/ui/copy-to-clipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PriceAndTitleProps = {
  ad: AdWithUser;
  isPreview?: boolean;
  isAccepted: boolean;
  locale: string;
};

export function PriceAndTitle({
  ad,
  locale,
  isPreview,
  isAccepted,
}: PriceAndTitleProps) {
  const tAd = useTranslations("/ad/[adId]");
  const adUrl = absoluteURL(`/${locale}/ad/${ad.id}`);

  const shouldShowTooltip = !isAccepted && !isPreview;
  const tooltipContent = tAd("tooltip.only-when-accepted");

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between text-3xl text-primary md:text-5xl">
            <span className="flex items-center justify-center gap-3">
              {getLocalizedPrice(locale, ad.price)}{" "}
              {ad.negotiable && (
                <Badge className="px-3 py-1 text-xl" variant="secondary">
                  {tAd("negotiable")}
                </Badge>
              )}
            </span>
            <div className="flex flex-wrap gap-2">
              {shouldShowTooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <FavoritesHeart
                        disabled={isPreview || !isAccepted}
                        adId={ad.id}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{tooltipContent}</TooltipContent>
                </Tooltip>
              ) : (
                <FavoritesHeart
                  disabled={isPreview || !isAccepted}
                  adId={ad.id}
                />
              )}

              {shouldShowTooltip ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <CopyToClipboardButton
                        toBeCopiedText={adUrl}
                        disabled={isPreview || !isAccepted}
                        variant="ghost"
                        size={"icon"}
                        copyText={""}
                        copiedText={""}
                        icon="share"
                        aria-label={tAd("share.button")}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{tooltipContent}</TooltipContent>
                </Tooltip>
              ) : (
                <CopyToClipboardButton
                  toBeCopiedText={adUrl}
                  disabled={isPreview || !isAccepted}
                  variant="ghost"
                  size={"icon"}
                  copyText={""}
                  copiedText={""}
                  icon="share"
                  aria-label={tAd("share.button")}
                />
              )}
            </div>
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
    </TooltipProvider>
  );
}
