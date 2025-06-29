"use client";
import { AsyncSearch } from "@/components/ui/async-search";
import { useCategoryTranslations } from "@/lib/client-side";
import { absoluteURL } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

async function fetchData(query?: string) {
  if (!query || query.length < 2) return [];
  const limitedQuery = query.trim().slice(0, 50);

  const response = await fetch(
    absoluteURL(`/api/bee3/searchbox?q=${encodeURIComponent(limitedQuery)}`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    console.warn(`Search request failed: ${response.status}`);
    return [];
  }

  const data = await response.json();

  // Handle API errors gracefully
  if (data.error) {
    console.warn("Search API error:", data.error);
    return [];
  }

  let { categorizedHits = [], uncategorizedHits = [] } = data;

  // Ensure uncategorizedHits is an array and transform it
  if (Array.isArray(uncategorizedHits)) {
    uncategorizedHits = uncategorizedHits.map((hit: string) => ({
      title: hit,
    }));
  } else {
    uncategorizedHits = [];
  }

  // Ensure categorizedHits is an array
  if (!Array.isArray(categorizedHits)) {
    categorizedHits = [];
  }

  return [...categorizedHits, { title: limitedQuery }, ...uncategorizedHits];
}
type fetchedDataType = {
  title: string;
  category?: {
    categoryPath: string;
  };
};

function AdSearchboxInput({ onSearch }: { onSearch?: () => void }) {
  const t = useTranslations("ad-searchbox");
  const router = useRouter();
  const { getClientSideFullCategory } = useCategoryTranslations();
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
                {t("in")} {getClientSideFullCategory(category.categoryPath)}
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
        onSearch?.();
      }}
    />
  );
}

export default AdSearchboxInput;
