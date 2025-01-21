import { getLocale } from "next-intl/server";
import Image from "next/image";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { type Ad } from "@prisma/client";
import { Link } from "@/navigation";
import { cn, getLocalizedDate, getLocalizedPrice } from "@/lib/utils";
import { Suspense } from "react";
import AdCardPlaceholder from "../placeholders/ad-card-placeholder";
import { getLocalizedLocation } from "@/lib/utils";
import FavoritesHeart from "./favorites-heart";

type Props = {
  ad: Ad;
  orientation?: "horizontal" | "vertical";
};

async function AdCard({ ad, orientation = "vertical" }: Props) {
  const locale = await getLocale();

  return (
    <Suspense
      fallback={
        <AdCardPlaceholder orientation={orientation}></AdCardPlaceholder>
      }
    >
      <Link href={`/ad/${ad.id}`}>
        <Card
          className={cn(orientation === "vertical" ? "w-[300px]" : "w-full")}
        >
          <CardContent
            className={cn(
              "flex p-0",
              orientation === "vertical"
                ? "flex-col"
                : "h-full justify-between",
            )}
          >
            <Image
              src={ad.images[0] ?? ""}
              alt={`${ad.title} image`}
              width="200"
              height="200"
              className={cn(
                "object-cover",
                orientation === "vertical"
                  ? "h-[200px] w-full rounded-t-lg"
                  : "h-full w-[200px] rounded-s-lg",
              )}
            />
            <div
              className={cn(
                "space-y-2 p-4",
                orientation === "horizontal" &&
                  "flex h-full w-full flex-col justify-between",
              )}
            >
              <CardTitle className="relative flex w-full items-center justify-between">
                <span
                  className={cn(
                    "w-full font-semibold text-primary",
                    orientation === "horizontal" ? "text-3xl" : "text-lg",
                  )}
                >
                  {getLocalizedPrice(locale, ad.price)}
                </span>
                <FavoritesHeart
                  className={cn(
                    orientation === "horizontal" ? "size-7" : "size-6",
                  )}
                  adId={ad.id}
                />
              </CardTitle>
              {orientation === "horizontal" ? (
                <>
                  <h1 className="text-xl font-bold">{ad.title}</h1>{" "}
                  <p className="hidden text-sm md:block">{ad.description}</p>
                </>
              ) : (
                <p className="text-sm">{ad.title}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span>{getLocalizedLocation(locale, ad.cityId)}</span>
                <span>{getLocalizedDate(locale, ad.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </Suspense>
  );
}

export default AdCard;
