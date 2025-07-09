"use client";
import React, { useState } from "react";
import { categoryIcons, CategoryIconType } from "@/consts/category-icons";
import { Avatar } from "@/components/ui/avatar";
import { categoriesTree, CategoryTreeItem } from "@/schema/categories-tree";

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
import { ForwardArrow } from "../ui/arrows";

function CategoryDialog({
  category,
  pathSegments = [],
  children,
}: {
  category: CategoryTreeItem;
  pathSegments?: string[];
  children: React.ReactNode;
}) {
  const tNavigation = useTranslations("/.navigation");
  const { getRecursiveCategoryName } = useCategoryTranslations();
  const [open, setOpen] = useState(false);

  const currentPathSegments = [...pathSegments, toPathFormat(category.name)];
  const categoryPath = currentPathSegments.join("/");
  const categoryName = getRecursiveCategoryName(currentPathSegments);

  const hasSubcategories =
    category.categories && category.categories.length > 0;

  if (!hasSubcategories) {
    return <Link href={`/${categoryPath}`}>{children}</Link>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-full max-w-2xl pb-0">
        <DialogHeader className="h-min">
          <DialogTitle>
            <Link
              tabIndex={-1}
              href={`/${categoryPath}`}
              onClick={() => setOpen(false)}
            >
              {categoryName}
            </Link>
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-[calc(100vh-100px)] flex-col overflow-auto">
          <Link
            className="text-primary hover:underline"
            href={`/${categoryPath}`}
            onClick={() => setOpen(false)}
          >
            {tNavigation("show-all")}
          </Link>
          <div className="flex w-full items-center justify-center">
            <Separator className="my-1 w-full" />
          </div>
          <div className="flex w-full flex-col gap-5 py-4">
            {category.categories?.map((subCategory) => {
              const hasSubcategories =
                subCategory.categories && subCategory.categories.length > 0;
              const subCategoryPathSegments = [
                ...currentPathSegments,
                toPathFormat(subCategory.name),
              ];
              const subCategoryName = getRecursiveCategoryName(
                subCategoryPathSegments,
              );

              return (
                <CategoryDialog
                  key={`category-${subCategory.id}`}
                  category={subCategory}
                  pathSegments={currentPathSegments}
                >
                  <p className="flex cursor-pointer items-center text-lg hover:underline focus:underline">
                    {subCategoryName}
                    {hasSubcategories && <ForwardArrow className="size-5" />}
                  </p>
                </CategoryDialog>
              );
            })}
          </div>
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
