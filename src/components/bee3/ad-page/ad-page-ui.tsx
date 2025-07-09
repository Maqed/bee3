import { Separator } from "@/components/ui/separator";
import { AdImages } from "./ad-images";
import { PriceAndTitle } from "./price-and-title";
import { AdDescription } from "./ad-description";
import { AdAttributes } from "./ad-attributes";
import { UserInformation } from "./user-information";
import SafetyTipsCard from "./safety-matters";
import RelatedAds from "@/components/bee3/ad-page/related-ads";
import type { AdWithUser } from "@/types/ad-page-types";
import { useLocale, useTranslations } from "next-intl";

type AdPageUIProps = {
  ad: AdWithUser;
  isPreview?: boolean;
};

export default function AdPageUI({ ad, isPreview = false }: AdPageUIProps) {
  const locale = useLocale();
  const tAd = useTranslations("/ad/[adId]");

  return (
    <div className="mt-10 grid grid-cols-12 gap-4 md:container md:mx-auto">
      <div className="col-span-12 flex flex-col gap-y-5 pb-20 md:col-span-8 md:pb-0">
        <AdImages ad={ad} />
        <div className="flex flex-col gap-y-5 max-sm:mx-1">
          <PriceAndTitle isPreview={isPreview} ad={ad} locale={locale} />
          <AdDescription ad={ad} tAd={tAd} />
          <AdAttributes ad={ad} />
          <UserInformation ad={ad} tAd={tAd} locale={locale} variant="mobile" />
          <SafetyTipsCard className="md:hidden" />
          <Separator />
          {!isPreview && (
            <RelatedAds adId={ad.id} relatedCategories={ad.categoryPath} />
          )}
        </div>
      </div>
      <div className="hidden space-y-3 md:col-span-4 md:block">
        <UserInformation ad={ad} tAd={tAd} locale={locale} />
        <SafetyTipsCard />
      </div>
    </div>
  );
}
