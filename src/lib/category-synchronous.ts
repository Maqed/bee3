import { useTranslations } from "next-intl";
import { getCategoryAndSubCategory } from "./category";

export function useCategoryTranslations() {
  const tCategory = useTranslations("categories");

  const getSynchronousFullCategory = (categoryPath: string) => {
    const { category, subCategory } = getCategoryAndSubCategory(categoryPath);
    if (!subCategory) return getSynchronousCategory(category);
    return `${getSynchronousCategory(category)} - ${getSynchronousSubCategory(category, subCategory)}`;
  };

  const getSynchronousCategory = (category: string) => {
    return tCategory(`${category}.name`);
  };

  const getSynchronousSubCategory = (category: string, subCategory: string) => {
    return tCategory(`${category}.categories.${subCategory}.name`);
  };

  return {
    getSynchronousFullCategory,
    getSynchronousCategory,
    getSynchronousSubCategory,
  };
}
