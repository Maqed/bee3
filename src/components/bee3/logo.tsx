"use client";
import { useTranslations } from "next-intl";

export function Logo() {
  const t = useTranslations();
  return <>{t("logo")}</>;
}

export default Logo;
