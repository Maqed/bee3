"use client";
import { useLocale } from "next-intl";
import { Heart } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { type Ad } from "@prisma/client";
import { Link } from "@/navigation";
import { cn, getLocalizedDate, getLocalizedPrice } from "@/lib/utils";
import { Suspense } from "react";
import AdCardPlaceholder from "../placeholders/ad-card-placeholder";
import { getLocalizedLocation } from "@/lib/utils";

type Props = {
  ad: Ad;
  orientation?: "horizontal" | "vertical";
};

function AdCard({ ad, orientation = "vertical" }: Props) {
  const locale = useLocale();
  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
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
              width="300"
              height="200"
              className={cn(
                "object-contain",
                orientation === "vertical"
                  ? "h-[200px] w-full rounded-t-lg"
                  : "h-full w-[350px] rounded-s-lg",
              )}
            />
            <div
              className={cn(
                "space-y-2 p-4",
                orientation === "horizontal" &&
                  "flex h-full w-full flex-col justify-between",
              )}
            >
              <div className="relative flex w-full items-center justify-between">
                <span className="w-full text-lg font-semibold text-primary">
                  {getLocalizedPrice(locale, ad.price)}
                </span>
                <Heart
                  onClick={handleHeartClick}
                  className="absolute end-0 h-5 w-5 cursor-pointer text-foreground/70 transition-all hover:fill-red-500 hover:text-red-600"
                />
              </div>
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
