import { getTranslations } from "next-intl/server";
import {
  getServerSideCategory,
  getServerSideSubCategory,
} from "@/lib/server-side";
import {
  absoluteURL,
  getCategoryAndSubCategory,
  getLocalizedPrice,
} from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";
import AdPageUI from "@/components/bee3/ad-page/ad-page-ui";
import { Metadata } from "next";
import { notFound } from "next/navigation";

async function fetchAdData(adId: string): Promise<AdWithUser | null> {
  const response = await fetch(absoluteURL(`/api/bee3/ad/${adId}`));
  const { ad } = await response.json();
  return ad;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; adId: string };
}): Promise<Metadata> {
  const ad = await fetchAdData(params.adId);

  if (!ad) {
    const tAd = await getTranslations("/ad/[adId].metadata");
    return { title: tAd("ad-not-found") };
  }
  const { category, subCategory } = getCategoryAndSubCategory(ad.categoryPath);
  let localizedCategory = await getServerSideCategory(category);

  if (subCategory) {
    localizedCategory = await getServerSideSubCategory(category, subCategory);
  }

  const localizedPrice = getLocalizedPrice(params.locale, ad.price);

  const title = `${ad.title} - ${localizedCategory} - ${localizedPrice}`;
  const description = ad.description;
  const images = ad.images;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      images,
    },
    twitter: {
      title,
      description: description ?? undefined,
      images,
    },
  };
}

export default async function AdPage({ params }: { params: { adId: string } }) {
  const ad = await fetchAdData(params.adId);

  if (!ad) {
    notFound();
  }

  return <AdPageUI ad={ad} />;
}
