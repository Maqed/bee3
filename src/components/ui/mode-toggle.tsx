"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
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
          "hidden h-[1.5rem] w-[1.3rem] fill-yellow-500 text-yellow-500 dark:block",
          { "me-1": showToggleThemeText },
        )}
      />
      <Moon
        className={cn("h-5 w-5 fill-foreground dark:hidden", {
          "me-1": showToggleThemeText,
        })}
      />
      <span className={cn({ "sr-only": !showToggleThemeText })}>
        {t("toggle-theme")}
      </span>
    </RenderAs>
  );
}
