import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "@/env";
import { governorates } from "@/schema/governorates";
import { cities } from "@/schema/cities";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Compressor from "compressorjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalizedDate(locale: string, date: Date): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getLocalizedTime(locale: string, date: Date): string {
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getLocalizedPrice(locale: string, price: number) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(price);
}
export function getLocalizedTimeAgo(
  locale: string,
  date: Date | string | undefined,
): string {
  if (!date) return "";

  const inputDate = new Date(date);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - inputDate.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

  const timeUnits = [
    { unit: "second", limit: 60, value: diffInSeconds },
    { unit: "minute", limit: 60, value: Math.floor(diffInSeconds / 60) },
    { unit: "hour", limit: 24, value: Math.floor(diffInSeconds / 3600) },
    { unit: "day", limit: 30, value: Math.floor(diffInSeconds / 86400) },
    { unit: "month", limit: 12, value: Math.floor(diffInSeconds / 2592000) },
  ];

  for (const { unit, limit, value } of timeUnits) {
    if (value < limit) {
      return new Intl.RelativeTimeFormat(locale).format(
        -value,
        unit as Intl.RelativeTimeFormatUnit,
      );
    }
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    inputDate,
  );
}

export function absoluteURL(url: string) {
  if (!url.startsWith("/")) url = "/" + url;
  return `${env.NEXT_PUBLIC_APP_URL}${url}`;
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

const shimmerPlaceholder = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;
const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const generateImagePlaceholder = (
  w: number,
  h: number,
): PlaceholderValue =>
  `data:image/svg+xml;base64,${toBase64(shimmerPlaceholder(w, h))}`;

export const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, { type: blob.type });
};

type CompressorOptions = {
  quality: number;
  maxHeight: number;
  maxWidth: number;
};

export const optimizeImage = async (
  file: File,
  options: CompressorOptions,
): Promise<File> => {
  const MAX_FILE_SIZE = 100 * 1024; // 100kB
  let quality = options.quality;
  let maxWidth = options.maxWidth;
  let maxHeight = options.maxHeight;

  // Try progressively more aggressive compression until we get under 100kB
  while (quality > 0.1) {
    try {
      const result = await new Promise<Blob>((resolve, reject) => {
        new Compressor(file, {
          quality,
          maxWidth,
          maxHeight,
          success: resolve,
          error: reject,
        });
      });

      // If the compressed file is under 100kB, we're done
      if (result.size <= MAX_FILE_SIZE) {
        return blobToFile(result, file.name);
      }

      // If still too large, try more aggressive compression
      quality -= 0.1;

      // Also reduce dimensions if quality is getting very low
      if (quality < 0.4) {
        maxWidth = Math.floor(maxWidth * 0.8);
        maxHeight = Math.floor(maxHeight * 0.8);
      }
    } catch (error) {
      // If compression fails, try with lower quality
      quality -= 0.1;
    }
  }

  // Final attempt with very low quality and small dimensions
  return await new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.1,
      maxWidth: Math.floor(maxWidth * 0.5),
      maxHeight: Math.floor(maxHeight * 0.5),
      success: (result) => {
        const optimizedFile = blobToFile(result, file.name);
        resolve(optimizedFile);
      },
      error: reject,
    });
  });
};

export async function optimizeImages(
  images: File[],
  options: CompressorOptions,
): Promise<File[]> {
  const optimizedImages = images.map((image) => optimizeImage(image, options));
  return Promise.all(optimizedImages);
}

// Range filter utilities
export function parseRangeValue(filterValue: string) {
  if (!filterValue) return { min: undefined, max: undefined };

  if (filterValue.includes("-")) {
    const [minStr, maxStr] = filterValue.split("-");
    return {
      min: minStr ? Number(minStr) : 0,
      max: maxStr ? Number(maxStr) : undefined,
    };
  } else {
    return {
      min: Number(filterValue),
      max: undefined,
    };
  }
}

export function formatRangeValue(
  min: number | undefined,
  max: number | undefined,
): string {
  if (!min && !max) return "";
  return `${min ?? 0}-${max ?? ""}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
