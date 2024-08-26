import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdsCarousel() {
  const t = await getTranslations("/.ads-carousel");
  const locale = await getLocale();
  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Category Ads</h2>
          {/* Put actual data */}
          <Link
            href="/"
            className="group text-sm text-primary hover:underline"
            prefetch={false}
          >
            {t("show-more")}
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
            <CarouselItem>{/* Put actual data */}</CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
