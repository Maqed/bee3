import { categoryIcons } from "@/consts/category-icons";
import { Avatar } from "@/components/ui/avatar";
import { getLocale, getTranslations } from "next-intl/server";
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
import { getCategoryName, toPathFormat } from "@/lib/utils";

async function ExploreCategories() {
  const tNavigation = await getTranslations("/.navigation");
  const locale = await getLocale();

  return (
    <section className="container">
      <Carousel opts={{ dragFree: true }} className="w-full whitespace-nowrap">
        <CarouselContent>
          {categoriesTree.map((category) => {
            const categoryNamePathFormat = toPathFormat(category.name_en);
            const icon = categoryIcons[categoryNamePathFormat];
            const categoryName = getCategoryName(locale, category);
            return (
              <CarouselItem key={categoryName}>
                <Dialog>
                  <DialogTrigger className="flex flex-col items-center justify-center">
                    <Avatar className="rounded-md bg-primary/40">{icon}</Avatar>
                    <p className="text-sm">{categoryName}</p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="h-min">
                      <DialogTitle>{categoryName}</DialogTitle>
                      <DialogDescription>
                        {tNavigation("choose-category")}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-start justify-start">
                      {category.categories?.map((subCategory) => {
                        const subCategoryNamePathFormat = toPathFormat(
                          subCategory.name_en,
                        );
                        const subCategoryName = getCategoryName(
                          locale,
                          subCategory,
                        );
                        return (
                          <Link
                            key={`explore-subcategory-${subCategoryNamePathFormat}`}
                            href={`/${categoryNamePathFormat}/${subCategoryNamePathFormat}`}
                            className="text-primary hover:underline"
                          >
                            {subCategoryName}
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
