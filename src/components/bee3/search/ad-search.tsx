import { absoluteURL } from "@/lib/utils";
import { MAX_SEARCHED_ADS } from "@/consts/ad-search";
import { AsyncSearch } from "@/components/ui/async-search";
import { Ad } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

async function fetchData(query?: string) {
  if (!query) return [];
  const response = await fetch(
    absoluteURL(`/api/bee3/search?q=${query}&pageSize=${MAX_SEARCHED_ADS}`),
    { method: "GET" },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch ads");
  }

  const { ads } = await response.json();
  return ads;
}

const AdSearch = () => {
  const t = useTranslations("ad-search");
  const router = useRouter();

  return (
    <AsyncSearch<Ad>
      fetcher={fetchData}
      placeholder={t("placeholder")}
      renderOption={(item) => <div>{item.title}</div>}
      getOptionValue={(item) => item.id}
      noResultsMessage={t("not-found")}
      onSearch={(ad) => {
        router.push(`/ad/${ad.id}`);
      }}
    />
  );
};

export default AdSearch;
