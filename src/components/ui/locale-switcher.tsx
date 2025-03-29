"use client";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";

function LocaleSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  function onSelectChange(nextLocale: "ar" | "en") {
    router.push(
      `/${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
      {
        locale: nextLocale,
      },
    );
  }
  return (
    <Button
      variant="ghost"
      onClick={() => onSelectChange(locale === "ar" ? "en" : "ar")}
    >
      {locale === "ar" ? (
        <div dir="ltr" className="flex flex-row gap-2">
          <Image
            src="https://flagsapi.com/US/flat/24.png"
            alt="USA Flag"
            className="object-contain"
            width={24}
            height={24}
          />
          English
        </div>
      ) : (
        <div
          dir="rtl"
          className="flex flex-row items-center justify-center gap-2"
        >
          <Image
            src="https://flagsapi.com/EG/flat/24.png"
            alt="EG Flag"
            className="object-contain"
            width={24}
            height={24}
          />
          العربية
        </div>
      )}
    </Button>
  );
}

export default LocaleSwitcher;
