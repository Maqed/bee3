import type { LocalePrefix } from "next-intl/routing";

export const locales = ["ar", "en"] as const;

export const localePrefix = "always" satisfies LocalePrefix;
