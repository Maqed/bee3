import { categoryIcons } from "@/consts/category-icons";
import { Avatar } from "@/components/ui/avatar";
import { CATEGORY_MOCK_DATA } from "@/consts/category";
import { getTranslations, getLocale } from "next-intl/server";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@/navigation";

async function ExploreCategories() {
  const t = await getTranslations("/.navigation");
  const locale = await getLocale();
  return (
    <section className="container">
      <h1 className="mb-5 text-2xl font-bold lg:text-3xl">{t("title")}</h1>

      <Carousel
        opts={{ dragFree: true, direction: locale === "ar" ? "rtl" : "ltr" }}
        className="w-full whitespace-nowrap"
      >
        <CarouselContent>
          {CATEGORY_MOCK_DATA.map((category) => {
            const icon = categoryIcons[category.title];
            return (
              <CarouselItem key={category.title}>
                <Dialog>
                  <DialogTrigger className="flex flex-col items-center justify-center">
                    <Avatar className="rounded-md bg-primary/40">{icon}</Avatar>
                    <p className="text-sm">{t(`${category.title}.title`)}</p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="h-min">
                      <DialogTitle>{t(`${category.title}.title`)}</DialogTitle>
                      <DialogDescription>
                        {t("choose-category")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-start justify-start">
                      {category.subCategories.map((subCategory) => {
                        return (
                          <Link
                            key={`explore-subcategory-${subCategory.title}`}
                            href={subCategory.href}
                            className="text-primary hover:underline"
                          >
                            {t(subCategory.title)}
                          </Link>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

export default ExploreCategories;
