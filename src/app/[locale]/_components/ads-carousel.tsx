import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ad } from "@prisma/client";
import { getServerSideFullCategory } from "@/lib/server-side";
import AdCard from "@/components/bee3/ad-card";

type Props = {
  categoryPath: string;
  ads: Ad[];
};

export default async function AdsCarousel({ categoryPath, ads }: Props) {
  const tCarousel = await getTranslations("/.ads-carousel");
  const intlCategory = await getServerSideFullCategory(categoryPath);
  const locale = await getLocale();
  return (
    <section className="container w-full py-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{intlCategory}</h2>
        {/* Put actual data */}
        <Link
          href={`/${categoryPath}`}
          className="group text-sm text-primary hover:underline"
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
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <AdCard ad={ad} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
