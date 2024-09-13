import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/env";

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
