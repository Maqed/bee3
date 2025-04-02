import { categoryIcons, CategoryIconType } from "@/consts/category-icons";
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
import { Separator } from "@/components/ui/separator";

async function ExploreCategories() {
  const tNavigation = await getTranslations("/.navigation");
  const locale = await getLocale();

  return (
    <section className="container">
      <Carousel opts={{ dragFree: true }} className="w-full whitespace-nowrap">
        <CarouselContent>
          {categoriesTree.map((category) => {
            const categoryNamePathFormat = toPathFormat(category.name_en);
            const categoryIconData = categoryIcons[categoryNamePathFormat];
            const CategoryIcon = categoryIconData?.icon as CategoryIconType;
            const categoryName = getCategoryName(locale, category);
            return (
              <CarouselItem key={categoryName}>
                <Dialog>
                  <DialogTrigger className="flex flex-col items-center justify-center">
                    <Avatar className="rounded-md bg-primary/60">
                      <CategoryIcon />
                    </Avatar>
                    <p className="text-sm">{categoryName}</p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader className="h-min">
                      <DialogTitle>
                        <Link tabIndex={-1} href={`/${categoryNamePathFormat}`}>
                          {categoryName}
                        </Link>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-start justify-start">
                      <Link
                        className="text-primary hover:underline"
                        href={`/${categoryNamePathFormat}`}
                      >
                        {tNavigation("show-all")}
                      </Link>
                      <div className="flex w-full items-center justify-center">
                        <Separator className="my-1 w-1/2" />
                      </div>
                      <div className="flex gap-5">
                        {category.categories?.map((subCategory) => {
                          const subCategoryNamePathFormat = toPathFormat(
                            subCategory.name_en,
                          );
                          const SubCategoryIcon = categoryIconData
                            ?.subCategories[
                            subCategoryNamePathFormat
                          ] as CategoryIconType;
                          const subCategoryName = getCategoryName(
                            locale,
                            subCategory,
                          );
                          return (
                            <Link
                              key={`explore-subcategory-${subCategoryNamePathFormat}`}
                              href={`/${categoryNamePathFormat}/${subCategoryNamePathFormat}`}
                              className="group flex flex-col items-center justify-center"
                            >
                              <Avatar className="rounded-md bg-primary/60">
                                <SubCategoryIcon />
                              </Avatar>
                              <p className="text-sm text-primary group-hover:underline group-focus:underline">
                                {subCategoryName}
                              </p>
                            </Link>
                          );
                        })}
                      </div>
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
