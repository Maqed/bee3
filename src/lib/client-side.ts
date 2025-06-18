import { useTranslations } from "next-intl";
import { getCategoryAndSubCategory } from "./utils";

export function useCategoryTranslations() {
  const tCategory = useTranslations("categories");

  const getClientSideFullCategory = (categoryPath: string) => {
    const { category, subCategory } = getCategoryAndSubCategory(categoryPath);
    if (!subCategory) return getClientSideCategory(category);
    return `${getClientSideCategory(category)} - ${getClientSideSubCategory(category, subCategory)}`;
  };

  const getClientSideCategory = (category: string) => {
    return tCategory(`${category}.name`);
  };

  const getClientSideSubCategory = (category: string, subCategory: string) => {
    return tCategory(`${category}.categories.${subCategory}.name`);
  };

  return {
    getClientSideFullCategory,
    getClientSideCategory,
    getClientSideSubCategory,
  };
}
