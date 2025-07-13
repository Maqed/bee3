import React from "react";
import { getTranslations } from "next-intl/server";
import AdsCarousel from "@/components/bee3/ads-carousel";
import { db } from "@/server/db";
import { NUMBER_OF_ADS_IN_CAROUSEL } from "@/consts/ad";
import { Ad } from "@/types/bee3";

type Props = { adId: string; relatedCategories: string };

async function RelatedAds({ adId, relatedCategories }: Props) {
  const tAd = await getTranslations("/ad/[adId]");

  try {
    const relatedAds = await db.ad.findMany({
      where: {
        categoryPath: relatedCategories,
        NOT: {
          id: adId,
        },
      },
      include: {
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      take: NUMBER_OF_ADS_IN_CAROUSEL,
    });

    return relatedAds.length ? (
      <AdsCarousel
        title={tAd("related-ads")}
        showMoreHref={`/${relatedCategories}`}
        ads={relatedAds as Ad[]}
      />
    ) : null;
  } catch (error) {
    console.error("Error fetching related ads:", error);
    return null;
  }
}

export default RelatedAds;
