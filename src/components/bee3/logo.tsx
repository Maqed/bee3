"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Logo() {
  const t = useTranslations();
  return (
    <div
      dir="ltr"
      className="flex flex-row items-center justify-center gap-1 text-lg font-bold text-primary"
    >
      <Image src="/bee3-logo.png" alt="logo" width={30} height={25} />{" "}
      <span>Bee3</span>
    </div>
  );
}

export default Logo;
