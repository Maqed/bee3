"use client";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { ButtonProps } from "@/components/ui/button";
import { absoluteURL, cn } from "@/lib/utils";

function LocaleSwitcher({
  className,
  variant = "link",
  RenderAs,
  ...props
}: ButtonProps & { RenderAs: any }) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  function onSelectChange(nextLocale: "ar" | "en") {
    const url = `/${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    router.push(locale === "ar" ? url : absoluteURL(url), {
      locale: nextLocale,
    });
  }
  return (
    <RenderAs
      variant={variant}
      className={cn(
        "flex flex-row items-center justify-center gap-2 font-semibold",
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
    </RenderAs>
  );
}

export default LocaleSwitcher;
