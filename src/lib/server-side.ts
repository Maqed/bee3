import { getTranslations, getLocale } from "next-intl/server";
import { getCategoryAndSubCategory, getCity, getGovernorate } from "./utils";

export async function getServerSideFullCategory(categoryPath: string) {
  const { category, subCategory } = getCategoryAndSubCategory(categoryPath);
  if (!subCategory) return await getServerSideCategory(category);
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

export async function getServerSideFullLocation(cityId: number) {
  const locale = await getLocale();
  const city = getCity(cityId);
  const governorate = getGovernorate(city?.governorate_id as number);
  const governorateName =
    locale === "ar"
      ? governorate?.governorate_name_ar
      : governorate?.governorate_name_en;
  const cityName = locale === "ar" ? city?.city_name_ar : city?.city_name_en;
  return `${governorateName}, ${cityName}`;
}
