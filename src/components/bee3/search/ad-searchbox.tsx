"use client";
import { AsyncSearch } from "@/components/ui/async-search";
import { getCategoryName } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

async function fetchData(query?: string) {
  if (!query) return [];
  const response = await fetch(`/api/bee3/searchbox?q=${query}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ads");
  }

  const data = await response.json();
  let { categorizedHits, uncategorizedHits } = data;
  uncategorizedHits = uncategorizedHits.map((hit: string) => ({
    title: hit,
  }));

  return [...categorizedHits, { title: query }, ...uncategorizedHits];
}
type fetchedDataType = {
  title: string;
  category?: {
    categoryPath: string;
    name_en: string;
    name_ar: string;
  };
};

const AdSearch = () => {
  const t = useTranslations("ad-searchbox");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  return (
    <AsyncSearch<fetchedDataType>
      fetcher={fetchData}
      placeholder={t("placeholder")}
      setSearchTerm={setSearchValue}
      searchTerm={searchValue}
      renderOption={(suggestion) => {
        const { title, category } = suggestion;
        return (
          <div className="flex gap-1 group-data-[selected='true']:text-primary-foreground">
            {title}
            {category && (
              <span className="text-foreground/80 group-data-[selected='true']:text-primary-foreground/80">
                {t("in")} {getCategoryName(locale, category)}
              </span>
            )}
          </div>
        );
      }}
      onSubmit={() => {
        router.push(`/ads?q=${searchValue}`);
      }}
      getOptionValue={(suggestion) => {
        const { title, category } = suggestion;
        if (category) {
          return `/${category}?q=${title}`;
        } else {
          return `/ads?q=${title}`;
        }
      }}
      noResultsMessage={t("not-found")}
      onSearch={(suggestion) => {
        const { title, category } = suggestion;
        setSearchValue(title);
        if (category) {
          router.push(`/${category.categoryPath}?q=${title}`);
        } else {
          router.push(`/ads?q=${title}`);
        }
      }}
    />
  );
};

export default AdSearch;
