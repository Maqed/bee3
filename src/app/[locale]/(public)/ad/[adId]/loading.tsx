import { Separator } from "@/components/ui/separator";
import {
  AdImagesPlaceholder,
  PriceAndTitlePlaceholder,
  DescriptionPlaceholder,
  UserInformationPlaceholder,
  ContactInfoPlaceholder,
  RelatedAdsPlaceholder,
} from "@/components/placeholders/ad-page-placeholder";
import SafetyTipsCard from "@/components/bee3/ad-page/safety-matters";

export default function AdPagePlaceholder() {
  return (
    <div className="mt-10 grid grid-cols-12 gap-4 md:container md:mx-auto">
      <div className="col-span-12 flex flex-col gap-y-5 pb-20 md:col-span-8 md:pb-0">
        <AdImagesPlaceholder />
        <div className="flex flex-col gap-y-5 max-sm:mx-1">
          <PriceAndTitlePlaceholder />
          <DescriptionPlaceholder />
          <UserInformationPlaceholder variant="mobile" />
          <SafetyTipsCard />
          <Separator />
          <RelatedAdsPlaceholder />
        </div>
        <ContactInfoPlaceholder />
      </div>
      <div className="hidden md:col-span-4 md:block">
        <UserInformationPlaceholder />
        <SafetyTipsCard />
      </div>
    </div>
  );
}
