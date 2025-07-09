import React from "react";
import { categoryIcons, CategoryIconType } from "@/consts/category-icons";
import { Avatar } from "@/components/ui/avatar";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "@/navigation";
import { toPathFormat } from "@/lib/category";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { useCategoryTranslations } from "@/lib/category-synchronous";

function ExploreCategories() {
  const tNavigation = useTranslations("/.navigation");
  const { getSynchronousCategory, getSynchronousSubCategory } =
    useCategoryTranslations();

  return (
    <section className="container">
      <Carousel opts={{ dragFree: true }} className="w-full whitespace-nowrap">
        <CarouselContent>
          {categoriesTree.map((category) => {
            const categoryNamePathFormat = toPathFormat(category.name);
            const categoryIconData = categoryIcons[categoryNamePathFormat];
            const CategoryIcon = categoryIconData?.icon as CategoryIconType;
            const categoryName = getSynchronousCategory(categoryNamePathFormat);
            return (
              <CarouselItem key={categoryName}>
                <Dialog>
                  <DialogTrigger className="flex flex-col items-center justify-center">
                    <Avatar className="rounded-md bg-primary/60">
                      <CategoryIcon className="size-[18px]" />
                    </Avatar>
                    <p className="text-sm">{categoryName}</p>
                  </DialogTrigger>
                  <DialogContent className="h-full max-w-2xl pb-0">
                    <DialogHeader className="h-min">
                      <DialogTitle>
                        <Link tabIndex={-1} href={`/${categoryNamePathFormat}`}>
                          {categoryName}
                        </Link>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex h-[calc(100vh-100px)] flex-col overflow-auto">
                      <Link
                        className="w-full text-primary hover:underline"
                        href={`/${categoryNamePathFormat}`}
                      >
                        {tNavigation("show-all")}
                      </Link>
                      <div className="flex w-full items-center justify-center">
                        <Separator className="my-1 w-full" />
                      </div>
                      <div className="flex w-full flex-col gap-5 py-4">
                        {category.categories?.map((subCategory) => {
                          const subCategoryNamePathFormat = toPathFormat(
                            subCategory.name,
                          );
                          const subCategoryName = getSynchronousSubCategory(
                            categoryNamePathFormat,
                            subCategoryNamePathFormat,
                          );
                          return (
                            <Link
                              key={`explore-subcategory-${subCategoryNamePathFormat}`}
                              href={`/${categoryNamePathFormat}/${subCategoryNamePathFormat}`}
                            >
                              <p className="text-lg hover:underline focus:underline">
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
