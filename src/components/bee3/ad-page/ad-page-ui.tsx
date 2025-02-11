import { Separator } from "@/components/ui/separator";
import { AdImages } from "./ad-images";
import { PriceAndTitle } from "./price-and-title";
import { AdDescription } from "./ad-description";
import { UserInformation } from "./user-information";
import { MobileContactInfo } from "./contact-info";
import SafetyTipsCard from "./safety-matters";
import RelatedAds from "@/components/bee3/ad-page/related-ads";
import type { AdWithUser } from "@/types/ad-page-types";
import { getLocale, getTranslations } from "next-intl/server";

type AdPageUIProps = {
  ad: AdWithUser;
};

export default async function AdPageUI({ ad }: AdPageUIProps) {
  const locale = await getLocale();
  const tAd = await getTranslations("/ad/[adId]");

  return (
    <>
      <div className="col-span-12 flex flex-col gap-y-5 pb-20 md:col-span-8 md:pb-0">
        <AdImages ad={ad} />
        <div className="flex flex-col gap-y-5 max-sm:mx-1">
          <PriceAndTitle ad={ad} locale={locale} />
          <AdDescription ad={ad} tAd={tAd} />
          <UserInformation ad={ad} tAd={tAd} locale={locale} variant="mobile" />
          <SafetyTipsCard className="md:hidden" />
          <Separator />
          <RelatedAds adId={ad.id} relatedCategories={ad.categoryPath} />
        </div>
        <MobileContactInfo phoneNumber={ad.user.phoneNumber} />
      </div>
      <div className="hidden space-y-3 md:col-span-4 md:block">
        <UserInformation ad={ad} tAd={tAd} locale={locale} />
        <SafetyTipsCard />
      </div>
    </>
  );
}
