"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import darkLogo from "/public/bee3-logo-dark.svg";
import lightLogo from "/public/bee3-logo-light.svg";

export function Logo() {
  const { theme } = useTheme();
  return (
    <div
      dir="ltr"
      className="flex flex-row items-center justify-center gap-2 text-lg font-bold text-primary"
    >
      <Image
        src={theme === "dark" ? darkLogo : lightLogo}
        alt="logo"
        width={40}
        height={40}
      />
      <span>Bee3</span>
    </div>
  );
}

export default Logo;
