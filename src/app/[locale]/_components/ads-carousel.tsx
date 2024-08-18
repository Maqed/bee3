import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
            <CarouselItem>
              <Card className="w-full max-w-[300px]">
                <CardContent className="p-0">
                  <Image
                    //   Put actual data
                    src="/placeholder.svg"
                    alt="Ad Image"
                    width="300"
                    height="200"
                    className="h-[200px] w-full rounded-t-lg object-cover"
                    style={{ aspectRatio: "300/200", objectFit: "cover" }}
                  />
                  <div className="space-y-2 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="flex w-full items-center justify-between text-lg font-semibold text-primary">
                        {/* Put actual data */}
                        <span>
                          {new Intl.NumberFormat(locale, {
                            style: "currency",
                            currency: "EGP",
                          }).format(5000)}
                        </span>
                        <Heart className="h-5 w-5 text-foreground/70 transition-all hover:text-red-500" />
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {/* Put actual data */}
                      Experience the ultimate in relaxation and luxury in our
                      stunning vacation home.
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {/* Put actual data */}
                      <span>Bali, Indonesia</span>
                      <span>
                        {new Intl.DateTimeFormat(locale, {
                          dateStyle: "long",
                          //  Put the actual date below
                        }).format(new Date())}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
