"use client";
import React from "react";
import { categoryIcons, CategoryIconType } from "@/consts/category-icons";
import { Avatar } from "@/components/ui/avatar";
import { categoriesTree, CategoryTreeItem } from "@/schema/categories-tree";
import { useRouter } from "@/navigation";

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
import { useCategoryTranslations } from "@/lib/category-synchronous";
import CategoryChooseStepperMobile from "./category-choose-stepper-mobile";

function CategoryDialog({
  category,
  children,
}: {
  category: CategoryTreeItem;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { getRecursiveCategoryName } = useCategoryTranslations();

  const categoryPathFormat = toPathFormat(category.name);
  const categoryPath = categoryPathFormat;
  const categoryName = getRecursiveCategoryName([categoryPathFormat]);

  const hasSubcategories =
    category.categories && category.categories.length > 0;

  // If no subcategories, directly link to the category path
  if (!hasSubcategories) {
    return <Link href={`/${categoryPath}`}>{children}</Link>;
  }

  const handleCategoryChoice = (chosenCategory: CategoryTreeItem) => {
    // Build the full path including the parent category
    const parentPath = toPathFormat(category.name);
    const childPath = toPathFormat(chosenCategory.name);
    const fullPath = `/${parentPath}/${childPath}`;

    router.push(fullPath);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-full max-w-2xl pb-0">
        <DialogHeader className="h-min">
          <DialogTitle>
            <Link tabIndex={-1} href={`/${categoryPath}`}>
              {categoryName}
            </Link>
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-[calc(100vh-100px)] flex-col overflow-auto">
          <CategoryChooseStepperMobile
            onChoice={handleCategoryChoice}
            defaultPath={category.name}
            categories={category.categories || []}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExploreCategories() {
  const { getSynchronousCategory } = useCategoryTranslations();

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
                <CategoryDialog category={category}>
                  <div className="flex cursor-pointer flex-col items-center justify-center">
                    <Avatar className="rounded-md bg-primary/60">
                      <CategoryIcon className="size-[18px]" />
                    </Avatar>
                    <p className="text-sm">{categoryName}</p>
                  </div>
                </CategoryDialog>
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
