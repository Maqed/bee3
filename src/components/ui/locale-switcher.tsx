"use client";
import Image from "next/image";
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
        <SelectItem value="en">
          <div className="flex flex-row gap-2">
            <Image
              src="/flags/us.png"
              alt="USA Flag"
              className="object-contain"
              width={20}
              height={10}
            />
            English
          </div>
        </SelectItem>
        <SelectItem value="ar">
          <div className="flex flex-row gap-2">
            <Image
              src="/flags/eg.png"
              alt="EG Flag"
              className="object-contain"
              width={20}
              height={10}
            />
            Arabic (العربية)
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export default LocaleSwitcher;
