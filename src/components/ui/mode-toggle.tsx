"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const t = useTranslations("Mode Toggle");
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="hidden h-[1.5rem] w-[1.3rem] fill-yellow-500 text-yellow-500 dark:block" />
      <Moon className="h-5 w-5 fill-foreground dark:hidden" />
      <span className="sr-only">{t("toggle-theme")}</span>
    </Button>
  );
}
