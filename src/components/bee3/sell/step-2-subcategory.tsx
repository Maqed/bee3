import React from "react";
import { useTranslations } from "next-intl";
import { categoriesTree } from "@/schema/categories-tree";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toPathFormat } from "@/lib/category";
import { categoryIcons, CategoryIconType } from "@/consts/category-icons";
import { useCategoryTranslations } from "@/lib/category-synchronous";
import { Listbox } from "@/components/ui/listbox";
import CategoryListboxItem from "./category-list-box-item";

interface Step2SubcategoryProps {
  selectedMainCategory: string | null;
  selectedSubCategory: string | null;
  onSubCategoryChange: (subCategory: string | null) => void;
  isPending: boolean;
}

function Step2Subcategory({
  selectedMainCategory,
  selectedSubCategory,
  onSubCategoryChange,
  isPending,
}: Step2SubcategoryProps) {
  const tSell = useTranslations("/sell");
  const { getSynchronousSubCategory } = useCategoryTranslations();

  const subCategories = selectedMainCategory
    ? categoriesTree.find((category) => category.name === selectedMainCategory)
        ?.categories || []
    : [];

  if (!selectedMainCategory) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          {tSell("step2.title")}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          {tSell("step2.description")}
        </p>
      </div>

      <FormItem className="space-y-3">
        <FormLabel className="text-base sm:text-lg">
          {tSell("category.sub.label")}
        </FormLabel>
        <FormControl>
          <Listbox
            value={selectedSubCategory || ""}
            onValueChange={(value) => onSubCategoryChange(value || null)}
            disabled={isPending}
            orientation="mixed"
            className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {subCategories.map((subCategory) => {
              const categoryNamePathFormat = toPathFormat(selectedMainCategory);
              const subCategoryNamePathFormat = toPathFormat(subCategory.name);
              const subCategoryName = getSynchronousSubCategory(
                categoryNamePathFormat,
                subCategoryNamePathFormat,
              );
              const SubCategoryIcon = categoryIcons[categoryNamePathFormat]
                ?.categories?.[subCategoryNamePathFormat]
                ?.icon as CategoryIconType;

              return (
                <CategoryListboxItem
                  key={subCategoryName}
                  value={subCategory.id.toString()}
                  Icon={SubCategoryIcon}
                  categoryName={subCategoryName}
                />
              );
            })}
          </Listbox>
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}

export default Step2Subcategory;
