import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ad } from "@/types/bee3";
import AdCard from "@/components/bee3/ad-card";

type Props = {
  title: string;
  showMoreHref: string;
  ads: Ad[];
};

export default async function AdsCarousel({ title, showMoreHref, ads }: Props) {
  const tCarousel = await getTranslations("ads-carousel");
  const locale = await getLocale();
  if (ads.length > 0)
    return (
      <section className="container w-full">
        <div className="mb-3 flex flex-wrap items-center justify-between">
          <h2 className="text-lg font-bold md:text-2xl">{title}</h2>
          <Link
            href={showMoreHref}
            className="group text-base font-bold text-primary hover:underline"
            prefetch={false}
          >
            {tCarousel("show-more")}
            <MoveRight
              className={cn(
                "ms-1 inline h-5 w-5 transition-all",
                locale === "ar" && "rotate-180",
                locale === "ar"
                  ? "group-hover:-translate-x-1"
                  : "group-hover:translate-x-1",
              )}
            />
          </Link>
        </div>
        <Carousel opts={{ dragFree: true }} className="w-full max-w-full">
          <CarouselContent className="p-1">
            {ads.map((ad) => (
              <CarouselItem key={ad.id}>
                <AdCard ad={ad} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  return null;
}
