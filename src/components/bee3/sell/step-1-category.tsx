import type React from "react";
import { useTranslations } from "next-intl";
import { categoriesTree } from "@/schema/categories-tree";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toPathFormat } from "@/lib/utils";
import { categoryIcons, CategoryIconType } from "@/consts/category-icons";
import { useCategoryTranslations } from "@/lib/client-side";
import { Listbox } from "@/components/ui/listbox";
import CategoryListboxItem from "./category-list-box-item";

interface Step1CategoryProps {
  selectedMainCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

function Step1Category({
  selectedMainCategory,
  onCategoryChange,
}: Step1CategoryProps) {
  const tSell = useTranslations("/sell");
  const { getClientSideFullCategory } = useCategoryTranslations();

  const mainCategories = categoriesTree;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          {tSell("step1.title")}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          {tSell("step1.description")}
        </p>
      </div>

      <FormItem className="space-y-3">
        <FormLabel className="text-base sm:text-lg">
          {tSell("category.main.label")}
        </FormLabel>
        <FormControl>
          <Listbox
            value={selectedMainCategory || ""} orientation="mixed"
            onValueChange={(value) => onCategoryChange(value || null)}
            className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {mainCategories.map((category) => {
              const categoryNamePathFormat = toPathFormat(category.name);
              const categoryName = getClientSideFullCategory(
                categoryNamePathFormat,
              );
              const CategoryIcon = categoryIcons[categoryNamePathFormat]
                ?.icon as CategoryIconType;

              return (
                <CategoryListboxItem
                  key={categoryName}
                  value={category.name}
                  Icon={CategoryIcon}
                  categoryName={categoryName}
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

export default Step1Category;
