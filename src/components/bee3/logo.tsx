"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Logo() {
  const t = useTranslations();
  return (
    <div
      dir="ltr"
      className="flex flex-row items-center justify-center gap-2 text-lg font-bold text-primary"
    >
      <Image src="/bee3-logo.svg" alt="logo" width={40} height={40} />{" "}
      <span>Bee3</span>
    </div>
  );
}

export default Logo;
