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
import { toPathFormat } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import {
  getServerSideCategory,
  getServerSideSubCategory,
} from "@/lib/server-side";

function ExploreCategories() {
  const tNavigation = useTranslations("/.navigation");

  return (
    <section className="container">
      <Carousel opts={{ dragFree: true }} className="w-full whitespace-nowrap">
        <CarouselContent>
          {categoriesTree.map(async (category) => {
            const categoryNamePathFormat = toPathFormat(category.name);
            const categoryIconData = categoryIcons[categoryNamePathFormat];
            const CategoryIcon = categoryIconData?.icon as CategoryIconType;
            const categoryName = await getServerSideCategory(
              categoryNamePathFormat,
            );
            return (
              <CarouselItem key={categoryName}>
                <Dialog>
                  <DialogTrigger className="flex flex-col items-center justify-center">
                    <Avatar className="rounded-md bg-primary/60">
                      <CategoryIcon />
                    </Avatar>
                    <p className="text-sm">{categoryName}</p>
                  </DialogTrigger>
                  <DialogContent className="pb-0">
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
                      <div className="flex h-full w-full items-center gap-4 py-4">
                        {category.categories?.map(async (subCategory) => {
                          const subCategoryNamePathFormat = toPathFormat(
                            subCategory.name,
                          );
                          const SubCategoryIcon = categoryIconData
                            ?.subCategories[
                            subCategoryNamePathFormat
                          ] as CategoryIconType;
                          const subCategoryName =
                            await getServerSideSubCategory(
                              categoryNamePathFormat,
                              subCategoryNamePathFormat,
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
