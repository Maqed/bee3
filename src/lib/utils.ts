import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedPrice(locale: string, price: number) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EGP",
  }).format(price);
}
export function getLocalizedDate(locale: string, date: Date | undefined) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(date);
}
