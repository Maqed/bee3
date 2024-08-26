import { categoryIcons } from "@/consts/category-icons";
import { Avatar } from "@/components/ui/avatar";
import { getTranslations } from "next-intl/server";
import { categoriesTree } from "@/schema/categories-tree";

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

  return (
    <section className="container">
      <Carousel opts={{ dragFree: true }} className="w-full whitespace-nowrap">
        <CarouselContent>
          {categoriesTree.categories.map((category) => {
            const icon = categoryIcons[category.name];
            return (
              <CarouselItem key={category.name}>
                <Dialog>
                  <DialogTrigger className="flex flex-col items-center justify-center">
                    <Avatar className="rounded-md bg-primary/40">{icon}</Avatar>
                    <p className="text-sm">{t(`${category.name}.name`)}</p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="h-min">
                      <DialogTitle>{t(`${category.name}.name`)}</DialogTitle>
                      <DialogDescription>
                        {t("choose-category")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-start justify-start">
                      {category.categories.map((subCategory) => {
                        return (
                          <Link
                            key={`explore-subcategory-${subCategory.name}`}
                            href={`/${category.name}/${subCategory.name}`}
                            className="text-primary hover:underline"
                          >
                            {t(
                              `${category.name}.categories.${subCategory.name}.name`,
                            )}
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
