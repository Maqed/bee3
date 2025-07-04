"use client";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function LocaleSwitcher({
  className,
  variant = "ghost",
  ...props
}: ButtonProps) {
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
      variant={variant}
      className={cn(
        "flex flex-row items-center justify-center gap-2",
        className,
      )}
      onClick={() => onSelectChange(locale === "ar" ? "en" : "ar")}
      dir={locale === "ar" ? "ltr" : "rtl"}
      {...props}
    >
      {locale === "ar" ? (
        <>
          <Image
            src="https://flagsapi.com/US/flat/24.png"
            alt="USA Flag"
            className="object-contain"
            width={24}
            height={24}
          />
          English
        </>
      ) : (
        <>
          <Image
            src="https://flagsapi.com/EG/flat/24.png"
            alt="EG Flag"
            className="object-contain"
            width={24}
            height={24}
          />
          العربية
        </>
      )}
    </Button>
  );
}

export default LocaleSwitcher;
