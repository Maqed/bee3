"use client";
import { useTranslations } from "next-intl";
import { getCategoryAndSubCategory } from "./utils";

export function getClientSideFullCategory(categoryPath: string) {
  const { category, subCategory } = getCategoryAndSubCategory(categoryPath);
  if (!subCategory) return getClientSideCategory(category);
  return `${getClientSideCategory(category)} - ${getClientSideSubCategory(category, subCategory)}`;
}

export function getClientSideCategory(category: string) {
  const tCategory = useTranslations("categories");
  return tCategory(`${category}.name`);
}

export function getClientSideSubCategory(
  category: string,
  subCategory: string,
) {
  const tCategory = useTranslations("categories");
  return tCategory(`${category}.categories.${subCategory}.name`);
}
