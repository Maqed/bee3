"use client";

import * as React from "react";
import { Sun } from "lucide-react";
import { RiMoonClearLine } from "react-icons/ri";
import { useTheme } from "next-themes";

import { ButtonProps } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function ModeToggle({
  showToggleThemeText = false,
  variant = "ghost",
  RenderAs,
  className,
  ...props
}: ButtonProps & {
  showToggleThemeText?: boolean;
  RenderAs: any;
}) {
  const { setTheme, theme } = useTheme();
  const t = useTranslations("Mode Toggle");
  return (
    <RenderAs
      variant={variant}
      size={showToggleThemeText ? "default" : "icon"}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(className)}
      {...props}
    >
      <Sun
        className={cn(
          "hidden size-7 fill-yellow-500 text-yellow-500 dark:block",
          { "me-1": showToggleThemeText },
        )}
      />
      <RiMoonClearLine
        className={cn("size-7 fill-secondary dark:hidden", {
          "me-1": showToggleThemeText,
        })}
      />
      <span
        className={cn(
          "font-semibold",
          { "text-secondary": theme === "light" },
          { "sr-only": !showToggleThemeText },
        )}
      >
        {t("toggle-theme")}
      </span>
    </RenderAs>
  );
}
