import { Suspense } from "react";
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
import { AdWithUser } from "./_components/ad-page-types";
import AdPageUI from "./_components/ad-page-ui";
import AdPagePlaceholder from "./_components/ad-page-placeholder";
import { notFound } from "next/navigation";

async function fetchAdData(adId: string): Promise<AdWithUser | null> {
  const response = await fetch(absoluteURL(`/api/bee3/ad/${adId}`));
  const { ad } = await response.json();
  return ad;
}

async function AdPageContent({ params }: { params: { adId: string } }) {
  const ad = await fetchAdData(params.adId);

  if (!ad) {
    notFound();
  }

  return <AdPageUI ad={ad} />;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; adId: string };
}) {
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

  return {
    title: `${ad.title} - ${localizedCategory} - ${localizedPrice}`,
    description: ad.description,
  };
}

export default function AdPage({ params }: { params: { adId: string } }) {
  return (
    <div className="mt-10 grid grid-cols-12 gap-4 md:container md:mx-auto">
      <Suspense fallback={<AdPagePlaceholder />}>
        <AdPageContent params={params} />
      </Suspense>
    </div>
  );
}
