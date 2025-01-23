import React from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  getLocalizedDate,
  getLocalizedPrice,
} from "@/lib/utils";
import FavoritesHeart from "@/components/bee3/favorites-heart";
import RelatedAds from "./related-ads";
import { AdWithUser } from "./ad-page-types";

type AdPageUIProps = {
  ad: AdWithUser;
};

async function AdPageUI({ ad }: AdPageUIProps) {
  const locale = await getLocale();
  const tAd = await getTranslations("/ad/[adId]");

  return (
    <>
      <div className="col-span-12 flex flex-col gap-y-5 md:col-span-8">
        {renderAdImages(ad)}
        <div className="flex flex-col gap-y-5 max-md:container">
          {renderPriceAndTitle(ad, locale)}
          {renderDescription(ad, tAd)}
          <Separator />
          <RelatedAds adId={ad.id} relatedCategories={ad.categoryPath} />
        </div>
      </div>
      {renderUserInformation(ad, tAd, locale)}
    </>
  );
}

function renderAdImages(ad: AdPageUIProps["ad"]) {
  if (ad.images.length > 1) {
    return (
      <Carousel>
        <CarouselContent>
          {ad.images.map((imageURL) => (
            <CarouselItem
              key={`carousel-item-${imageURL}`}
              className="min-w-0 shrink-0 grow-0 basis-full"
            >
              <Image
                width={1500}
                height={450}
                src={imageURL || "/placeholder.svg"}
                className="h-auto max-h-[450px] w-full object-contain"
                alt={ad.title}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="start-0 h-10 w-10 bg-background/40 md:h-12 md:w-12" />
        <CarouselNext className="end-0 h-10 w-10 bg-background/40 md:h-12 md:w-12" />
      </Carousel>
    );
  }

  return (
    <Image
      width={1500}
      height={450}
      src={ad.images[0]! || "/placeholder.svg"}
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
          <p>{getLocalizedDate(locale, ad.createdAt)}</p>
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

function renderUserInformation(
  ad: AdPageUIProps["ad"],
  tAd: any,
  locale: string,
) {
  return (
    <div className="hidden md:col-span-4 md:block">
      <Card>
        <CardHeader>
          <CardTitle>{tAd("user.posted-by")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href={`/user/${ad.user?.id}`}>
            <h5 className="text-lg font-bold">{ad.user?.name}</h5>
            <p>
              {tAd("user.member-since")}{" "}
              {getLocalizedDate(locale, ad.user?.createdAt)}
            </p>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col gap-y-3 *:w-full">
          <Button>
            <Phone className="me-1" /> {tAd("user.phone-number")}
          </Button>
          <Button>
            <MessageCircle className="me-1" /> {tAd("user.chat")}
          </Button>
          <Button variant="whatsapp">
            <MessageCircle className="me-1" /> {tAd("user.whatsapp")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdPageUI;
