import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { db } from "@/server/db";
import { getLocale } from "next-intl/server";
import {
  getServerSideCategory,
  getServerSideSubCategory,
} from "@/lib/server-side";
import {
  absoluteURL,
  getCategoryAndSubCategory,
  getLocalizedDate,
  getLocalizedPrice,
} from "@/lib/utils";
import { Link } from "@/navigation";
import Image from "next/image";
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
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AdsCarousel from "@/components/bee3/ads-carousel";
import { getLocalizedLocation } from "@/lib/utils";
import FavoritesHeart from "@/components/bee3/favorites-heart";
import { Ad } from "@prisma/client";

export async function generateMetadata({
  params,
}: {
  params: { adId: string };
}) {
  const adsRequest = await fetch(absoluteURL(`/api/bee3/ad/${params.adId}`));
  const {
    ad,
  }: { ad: Ad & { user: { id: string; name: string; createdAt: Date } } } =
    await adsRequest.json();
  if (!ad) {
    return { title: "Ad Not Found" };
  }
  const locale = await getLocale();
  const { category, subCategory } = getCategoryAndSubCategory(ad.categoryPath);
  let localizedCategory = await getServerSideCategory(category);
  if (subCategory)
    localizedCategory = await getServerSideSubCategory(category, subCategory);

  const localizedPrice = getLocalizedPrice(locale, ad.price);
  return {
    title: `${ad.title} - ${localizedCategory} - ${localizedPrice}`,
    description: ad.description,
  };
}

export default async function AdPage({ params }: { params: { adId: string } }) {
  const adsRequest = await fetch(absoluteURL(`/api/bee3/ad/${params.adId}`));
  const {
    ad,
  }: { ad: Ad & { user: { id: string; name: string; createdAt: Date } } } =
    await adsRequest.json();
  if (!ad) {
    return notFound();
  }
  const relatedAdsRequest = await fetch(
    absoluteURL(
      `/api/bee3/relatedAds?adId=${ad.id}&categoryPath=${ad.categoryPath}`,
    ),
  );
  const { relatedAds } = await relatedAdsRequest.json();
  const locale = await getLocale();
  const tAd = await getTranslations("/ad/[adId]");

  return (
    <div className="mt-10 grid grid-cols-12 gap-4 md:container md:mx-auto">
      {/* Ad Information */}
      <div className="col-span-12 flex flex-col gap-y-5 md:col-span-8">
        {ad.images.length > 1 ? (
          <Carousel>
            <CarouselContent>
              {ad.images.map((imageURL) => (
                <CarouselItem
                  className="min-w-0 shrink-0 grow-0 basis-full"
                  key={`carousel-item-${imageURL}`}
                >
                  <Image
                    width={1500}
                    height={450}
                    src={imageURL}
                    className="h-auto max-h-[450px] w-full object-contain"
                    alt={ad.title}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="start-0 h-10 w-10 bg-background/40 md:h-12 md:w-12" />
            <CarouselNext className="end-0 h-10 w-10 bg-background/40 md:h-12 md:w-12" />
          </Carousel>
        ) : (
          <Image
            width={1500}
            height={450}
            src={ad.images[0]!}
            className="h-auto max-h-[450px] w-full object-contain"
            alt={ad.title}
          />
        )}
        <div className="flex flex-col gap-y-5 max-md:container">
          {/* Price and Title */}
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
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{tAd("description")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{ad.description}</p>
            </CardContent>
          </Card>
          <Separator />
          {/* Related Ads */}
          {relatedAds.length ? (
            <AdsCarousel
              title={tAd("related-ads")}
              showMoreHref={`/${ad.categoryPath}`}
              ads={relatedAds}
            />
          ) : null}
        </div>
      </div>
      {/* User Information */}
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
          {/* TODO: Make it work */}
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
    </div>
  );
}
