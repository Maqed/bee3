import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { type Ad } from "@/types/bee3";
import { Link } from "@/navigation";
import {
  cn,
  generateImagePlaceholder,
  getLocalizedTimeAgo,
  getLocalizedPrice,
} from "@/lib/utils";
import { getLocalizedLocation } from "@/lib/utils";
import FavoritesHeart from "./favorites-heart";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "../ui/badge";

type Props = {
  ad: Ad;
  orientation?: "horizontal" | "vertical";
  cardClassName?: string;
};

function AdCard({ ad, orientation = "vertical", cardClassName }: Props) {
  const locale = useLocale();
  const tAd = useTranslations("/ad/[adId]");

  return (
    <Link title={ad.title} href={`/ad/${ad.id}`}>
      <Card
        className={cn(
          orientation === "vertical"
            ? "w-[225px] md:w-[275px] lg:w-[300px]"
            : "w-full",
          cardClassName,
        )}
      >
        <CardContent
          className={cn(
            "flex flex-col p-0",
            orientation === "horizontal" &&
              "md:h-full md:flex-row md:justify-between",
          )}
        >
          <Image
            src={ad.images[0]?.url ?? ""}
            alt={`${ad.title} image`}
            placeholder={
              orientation === "horizontal"
                ? generateImagePlaceholder(200, 250)
                : generateImagePlaceholder(150, 300)
            }
            width="1200"
            height="1200"
            className={cn(
              "h-[150px] w-full rounded-t-lg object-cover",
              orientation === "horizontal" &&
                "md:h-[200px] md:w-[250px] md:rounded-s-lg md:rounded-t-none",
            )}
          />
          <div
            className={cn(
              "space-y-2 p-4",
              orientation === "horizontal" &&
                "md:flex md:h-full md:w-full md:flex-col md:justify-between",
            )}
          >
            <CardTitle className="relative flex w-full items-center justify-between">
              <span
                className={cn(
                  "flex w-full items-center gap-1 text-xl font-semibold text-primary",
                  orientation === "horizontal" && "md:text-3xl",
                )}
              >
                {getLocalizedPrice(locale, ad.price)}
                {ad.negotiable && (
                  <Badge variant="secondary">{tAd("negotiable")}</Badge>
                )}
              </span>
              <FavoritesHeart
                className={cn(orientation === "horizontal" && "md:size-7")}
                adId={ad.id}
              />
            </CardTitle>
            <h1
              className={cn("text-sm", {
                "md:text-xl md:font-bold": orientation === "horizontal",
              })}
            >
              {ad.title.length > 40
                ? `${ad.title.substring(0, 40)}...`
                : ad.title}
            </h1>
            <p
              className={cn("hidden text-sm", {
                "md:block": orientation == "horizontal",
              })}
            >
              {ad.description && ad.description.length > 40
                ? `${ad.description?.substring(0, 40)}...`
                : ad.description}
            </p>
            <div
              className={cn("text-sm", {
                "flex items-center justify-between":
                  orientation === "horizontal",
              })}
            >
              <div>{getLocalizedLocation(locale, ad.cityId)}</div>
              <div>{getLocalizedTimeAgo(locale, ad.createdAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default AdCard;
