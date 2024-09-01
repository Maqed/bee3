import { getTranslations } from "next-intl/server";
import { getCategoryAndSubCategory } from "./utils";

export async function getServerSideFullCategory(categoryPath: string) {
  const { category, subCategory } = getCategoryAndSubCategory(categoryPath);

  return `${await getServerSideCategory(category)} - ${await getServerSideSubCategory(category, subCategory)}`;
}

export async function getServerSideCategory(category: string) {
  const tCategory = await getTranslations("categories");
  return tCategory(`${category}.name`);
}

export async function getServerSideSubCategory(
  category: string,
  subCategory: string,
) {
  const tCategory = await getTranslations("categories");
  return tCategory(`${category}.categories.${subCategory}.name`);
}
