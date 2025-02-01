import React from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDot,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getLocalizedLocation,
  getLocalizedTimeAgo,
  getLocalizedPrice,
  generateImagePlaceholder,
} from "@/lib/utils";
import FavoritesHeart from "@/components/bee3/favorites-heart";
import RelatedAds from "./related-ads";
import { AdWithUser } from "./ad-page-types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import WhatsAppButton from "@/components/bee3/contact-info/whatsapp-button";
import PhoneButton from "@/components/bee3/contact-info/phone-button";

type AdPageUIProps = {
  ad: AdWithUser;
};

async function AdPageUI({ ad }: AdPageUIProps) {
  const locale = await getLocale();
  const tAd = await getTranslations("/ad/[adId]");

  return (
    <>
      <div className="col-span-12 flex flex-col gap-y-5 pb-20 md:col-span-8 md:pb-0">
        {renderAdImages(ad)}
        <div className="flex flex-col gap-y-5 max-sm:mx-1">
          {renderPriceAndTitle(ad, locale)}
          {renderDescription(ad, tAd)}
          {renderUserInformationMobile(ad, tAd, locale)}
          <Separator />
          <RelatedAds adId={ad.id} relatedCategories={ad.categoryPath} />
        </div>
        {renderContactInfoMobile(ad.user.phoneNumber)}
      </div>
      {renderUserInformationDesktop(ad, tAd, locale)}
    </>
  );
}

function renderAdImages(ad: AdPageUIProps["ad"]) {
  if (ad.images.length > 1) {
    return (
      <Carousel>
        <CarouselContent className="mb-3">
          {ad.images.map((imageURL, index) => (
            <CarouselItem
              key={`carousel-item-${imageURL}`}
              className="min-w-0 shrink-0 grow-0 basis-full"
            >
              <Image
                priority={index == 0 || index == 1 ? true : false}
                width={1500}
                height={450}
                src={imageURL}
                placeholder={generateImagePlaceholder(1500, 450)}
                className="h-auto max-h-[450px] w-full object-contain"
                alt={ad.title}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max gap-x-2 p-1 pb-3">
            {ad.images.map((imageURL, index) => (
              <CarouselDot
                className="inline hover:outline hover:outline-2 hover:outline-primary"
                key={`carousel-dot-${imageURL}`}
                index={index}
              >
                <Image
                  width={100}
                  height={100}
                  src={imageURL}
                  placeholder={generateImagePlaceholder(100, 100)}
                  className="h-auto max-h-[100px] w-full object-contain"
                  alt={ad.title}
                />
              </CarouselDot>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Carousel>
    );
  }

  return (
    <Image
      priority
      width={1500}
      height={450}
      placeholder={generateImagePlaceholder(1500, 450)}
      src={ad.images[0]!}
      className="h-auto max-h-[450px] w-full object-contain"
      alt={ad.title}
    />
  );
}

function renderPriceAndTitle(ad: AdPageUIProps["ad"], locale: string) {
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

function renderDescription(ad: AdPageUIProps["ad"], tAd: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAd("description")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{ad.description}</p>
      </CardContent>
    </Card>
  );
}
function renderUserInformationMobile(
  ad: AdPageUIProps["ad"],
  tAd: any,
  locale: string,
) {
  return (
    <Card className="md:hidden">
      <Link href={`/user/${ad.user?.id}`}>
        <CardHeader>
          <CardTitle>{tAd("user.posted-by")}</CardTitle>
        </CardHeader>
        <CardContent>
          <h5 className="text-lg font-bold">{ad.user?.name}</h5>
          <p>
            {tAd("user.member-since")}{" "}
            {getLocalizedTimeAgo(locale, ad.user?.createdAt)}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
function renderUserInformationDesktop(
  ad: AdPageUIProps["ad"],
  tAd: any,
  locale: string,
) {
  return (
    <div className="hidden md:col-span-4 md:block">
      <Card>
        <UserInformation ad={ad} tAd={tAd} locale={locale} />
        <CardFooter className="flex flex-col gap-y-3">
          <ContactInfo showTitle={true} phoneNumber={ad.user.phoneNumber} />
        </CardFooter>
      </Card>
    </div>
  );
}
function renderContactInfoMobile(phoneNumber: string) {
  return (
    <div className="fixed bottom-0 start-0 flex w-full items-center justify-center gap-3 border-t bg-background py-3 md:hidden">
      <ContactInfo showTitle={false} phoneNumber={phoneNumber} />
    </div>
  );
}
function UserInformation({
  ad,
  tAd,
  locale,
}: {
  ad: AdPageUIProps["ad"];
  tAd: any;
  locale: string;
}) {
  return (
    <Link href={`/user/${ad.user?.id}`}>
      <CardHeader>
        <CardTitle>{tAd("user.posted-by")}</CardTitle>
      </CardHeader>
      <CardContent>
        <h5 className="text-lg font-bold">{ad.user?.name}</h5>
        <p>
          {tAd("user.member-since")}{" "}
          {getLocalizedTimeAgo(locale, ad.user?.createdAt)}
        </p>
      </CardContent>
    </Link>
  );
}
function ContactInfo({
  showTitle,
  phoneNumber,
}: {
  showTitle: boolean;
  phoneNumber: string;
}) {
  return (
    <>
      <PhoneButton showTitle={showTitle} phoneNumber={phoneNumber} />
      <WhatsAppButton showTitle={showTitle} phoneNumber={phoneNumber} />
    </>
  );
}

export default AdPageUI;
