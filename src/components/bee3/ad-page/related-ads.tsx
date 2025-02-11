import React from "react";
import { getTranslations } from "next-intl/server";
import { absoluteURL } from "@/lib/utils";
import AdsCarousel from "@/components/bee3/ads-carousel";

type Props = { adId: string; relatedCategories: string };

async function RelatedAds({ adId, relatedCategories }: Props) {
  const tAd = await getTranslations("/ad/[adId]");
  const relatedAdsRequest = await fetch(
    absoluteURL(
      `/api/bee3/relatedAds?adId=${adId}&categoryPath=${relatedCategories}`,
    ),
  );
  const { relatedAds } = await relatedAdsRequest.json();
  return relatedAds.length ? (
    <AdsCarousel
      title={tAd("related-ads")}
      showMoreHref={`/${relatedCategories}`}
      ads={relatedAds}
    />
  ) : null;
}

export default RelatedAds;
