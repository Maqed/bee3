"use client";
import React, { useState } from "react";
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
import { useTranslations } from "next-intl";
import { useCategoryTranslations } from "@/lib/category-synchronous";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategoryChooseStepperMobile from "./category-choose-stepper-mobile";

function CategoryDialog({
  category,
  children,
}: {
  category: CategoryTreeItem;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const tNavigation = useTranslations("/.navigation");
  const { getRecursiveCategoryName } = useCategoryTranslations();

  // State to track current navigation in the stepper
  const [currentNavigationPath, setCurrentNavigationPath] = useState<string[]>(
    [],
  );

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
    // Build the full path using the complete navigation path
    const chosenCategoryPath = toPathFormat(chosenCategory.name);
    const completePath =
      currentNavigationPath.length > 0
        ? [...currentNavigationPath, chosenCategoryPath]
        : [toPathFormat(category.name), chosenCategoryPath];

    const fullPath = `/${completePath.join("/")}`;

    router.push(fullPath);
  };

  const handleNavigationChange = (currentPath: string[]) => {
    setCurrentNavigationPath(currentPath);
  };

  // Build the current "show all" path based on navigation
  const currentShowAllPath =
    currentNavigationPath.length > 0
      ? currentNavigationPath.join("/")
      : categoryPath;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="h-full max-w-2xl pb-0">
        <DialogHeader className="h-min">
          <DialogTitle>
            <Link tabIndex={-1} href={`/${categoryPath}`}>
              {categoryName}
            </Link>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="flex flex-col p-1 pe-4">
            <Link
              className="text-xl font-bold text-primary hover:underline"
              href={`/${currentShowAllPath}`}
            >
              {tNavigation("show-all")}
            </Link>
            <div className="flex w-full items-center justify-center">
              <Separator className="my-1 w-full" />
            </div>
            <CategoryChooseStepperMobile
              onChoice={handleCategoryChoice}
              onNavigationChange={handleNavigationChange}
              defaultPath={category.name}
              categories={category.categories || []}
            />
          </div>
        </ScrollArea>
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
                  <div className="flex cursor-pointer flex-col items-center justify-center gap-0.5">
                    <Avatar className="rounded-md bg-primary/60">
                      <CategoryIcon className="size-[18px]" />
                    </Avatar>
                    <p className="w-20 text-wrap text-center text-[12px]">
                      {categoryName.length > 20
                        ? `${categoryName.slice(0, 20)}...`
                        : categoryName}
                    </p>
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
