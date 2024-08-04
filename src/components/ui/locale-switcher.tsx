"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/navigation";

function LocaleSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  function onSelectChange(nextLocale: "ar" | "en") {
    router.replace(`/${pathname}`, { locale: nextLocale });
  }
  return (
    <Select
      onValueChange={(value: "ar" | "en") => {
        onSelectChange(value);
      }}
      defaultValue={locale}
    >
      <SelectTrigger>
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="ar">Arabic (العربية)</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default LocaleSwitcher;
