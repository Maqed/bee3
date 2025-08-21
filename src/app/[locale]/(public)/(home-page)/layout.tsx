import { ReactNode } from "react";
import ExploreCategories from "@/components/bee3/explore-categories";
import SellButton from "@/components/bee3/sell-button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

function HomePageLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const t = useTranslations("");
  return (
    <main className="flex flex-col gap-y-5">
      <Link href="/about-us" className="container">
        <Image
          src={`/home-banner-${locale}.svg`}
          alt={t("home-banner.alt")}
          width={500}
          height={77}
          className="h-auto w-full"
        />
      </Link>
      <ExploreCategories />
      {children}
      <SellButton className="fixed bottom-4 left-1/2 -translate-x-1/2 transform bg-primary/95 md:hidden" />
    </main>
  );
}

export default HomePageLayout;
