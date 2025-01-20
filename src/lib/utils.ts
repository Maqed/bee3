import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/env";
import { governorates } from "@/schema/governorates";
import { cities } from "@/schema/cities";
import { CategoryTreeItem } from "@/schema/categories-tree";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedPrice(locale: string, price: number) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EGP",
  }).format(price);
}
export function getLocalizedDate(
  locale: string,
  date: Date | string | undefined,
) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(date as string));
}
export function getCategoryAndSubCategory(categoryPath: string) {
  const [category, subCategory] = categoryPath.split("/");
  if (!category) {
    throw new Error("Invalid category");
  }
  return { category, subCategory };
}
export function absoluteURL(url: string) {
  return `${env.NEXT_PUBLIC_APP_URL}/${url}`;
}
export function getLocalizedLocation(locale: string, cityId: number) {
  const city = getCity(cityId);
  const governorate = getGovernorate(city?.governorate_id as number);
  const governorateName =
    locale === "ar"
      ? governorate?.governorate_name_ar
      : governorate?.governorate_name_en;
  const cityName = locale === "ar" ? city?.city_name_ar : city?.city_name_en;
  return `${governorateName}, ${cityName}`;
}

export function getURLSearchParamsFromPageParams(searchParams: {
  [key: string]: string | undefined;
}) {
  let params = new URLSearchParams();

  // Add non-empty search params to the URLSearchParams object
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return params;
}
export function getGovernorate(governorateId: number) {
  return governorates.find((governorate) => governorate.id === governorateId);
}
export function getCity(cityId: number) {
  return cities.find((city) => city.id === cityId);
}
export function toPathFormat(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}
