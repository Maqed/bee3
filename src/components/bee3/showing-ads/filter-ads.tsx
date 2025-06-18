"use client";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LocationCombobox from "../location-combobox";
import OptionsFilter from "./options-filter";
import { getCategoryAndSubCategory } from "@/lib/utils";

type Props = {
  onApplyFilter?: () => void;
  categoryPath?: string[];
};

function FilterAds({ onApplyFilter, categoryPath }: Props) {
  const t = useTranslations("filter-ads");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get category information if categoryPath is provided
  const categoryInfo = categoryPath
    ? getCategoryAndSubCategory(categoryPath)
    : null;

  // Get initial values from search params
  const priceRange = searchParams.get("price")?.split("-");
  const initialMin = priceRange ? Number(priceRange[0]) : undefined;
  const initialMax = priceRange ? Number(priceRange[1]) : undefined;
  const initialGovId = Number(searchParams.get("governorate") || "0");
  const initialCityId = Number(searchParams.get("city") || "0");

  // State for price filter
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMin);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMax);

  // State for sorting
  const [sort, setSort] = useState(searchParams.get("sort") ?? "date");
  const [order, setOrder] = useState(searchParams.get("order") ?? "desc");

  // State for location selection
  const [governorate, setGovernorate] = useState<number>(initialGovId);
  const [city, setCity] = useState<number>(initialCityId);

  // State for category attributes filters
  const [attributeFilters, setAttributeFilters] = useState<
    Record<string, string>
  >({});

  // Update filter states when search params change
  useEffect(() => {
    const priceRange = searchParams.get("price")?.split("-");
    if (priceRange) {
      setMinPrice(Number(priceRange[0]));
      setMaxPrice(Number(priceRange[1]));
    }

    const govId = searchParams.get("governorate");
    const citId = searchParams.get("city");

    if (govId) setGovernorate(Number(govId));
    if (citId) setCity(Number(citId));

    // Parse attribute filters from URL
    const attrFilters: Record<string, string> = {};
    const attrParams = searchParams.getAll("attrs");
    for (const attrParam of attrParams) {
      const attrFilters_part = attrParam.split(",");
      for (const filter of attrFilters_part) {
        const [name, value] = filter.split("=");
        if (name && value) {
          attrFilters[name.trim()] = value.trim();
        }
      }
    }
    setAttributeFilters(attrFilters);
  }, [searchParams]);

  const handleLocationChange = (newGovernorate: number, newCity: number) => {
    setGovernorate(newGovernorate);
    setCity(newCity);
  };

  const handleAttributeFiltersChange = (filters: Record<string, string>) => {
    setAttributeFilters(filters);
  };

  function handleApplyFilter() {
    const queryParams = new URLSearchParams({
      sort,
      order,
    });

    if (minPrice != undefined || maxPrice != undefined) {
      queryParams.set("price", `${minPrice ?? 0}-${maxPrice ?? 1000000000}`);
    }

    if (governorate > 0) {
      queryParams.set("governorate", governorate.toString());
    }

    if (city > 0) {
      queryParams.set("city", city.toString());
    }

    const attrFilterArray = Object.entries(attributeFilters)
      .filter(([, value]) => value && value.trim() !== "")
      .map(([name, value]) => `${name}=${value}`);

    if (attrFilterArray.length > 0) {
      queryParams.set("attrs", attrFilterArray.join(","));
    }

    if (typeof searchParams.get("q") === "string") {
      queryParams.set("q", searchParams.get("q") as string);
    }

    router.push(`${pathname}?${queryParams.toString()}`);

    if (onApplyFilter) {
      onApplyFilter();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">{t("title")}</h1>

      <div className="flex flex-col">
        <Label className="mb-2" htmlFor="location">
          {t("locationLabel")}
        </Label>
        <LocationCombobox
          initialGovernorate={governorate}
          initialCity={city}
          onLocationChange={handleLocationChange}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <Label className="mb-2" htmlFor="minPrice">
            {t("minPriceLabel")}
          </Label>
          <NumberInput
            id="minPrice"
            thousandSeparator=","
            value={minPrice}
            onValueChange={(value) => {
              setMinPrice(value ? value : undefined);
            }}
            placeholder={t("minPriceLabel")}
          />
        </div>
        <div className="flex flex-col">
          <Label className="mb-2" htmlFor="maxPrice">
            {t("maxPriceLabel")}
          </Label>
          <NumberInput
            id="maxPrice"
            thousandSeparator=","
            value={maxPrice}
            onValueChange={(value) => {
              setMaxPrice(value ? value : undefined);
            }}
            placeholder={t("maxPriceLabel")}
          />
        </div>
      </div>

      {/* Category-specific attribute filters */}
      {categoryInfo && (
        <OptionsFilter
          categoryInfo={categoryInfo}
          attributeFilters={attributeFilters}
          onAttributeFiltersChange={handleAttributeFiltersChange}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <Label className="mb-2" htmlFor="sort">
            {t("sortByLabel")}
          </Label>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder={t("sortByLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t("sortOptions.date")}</SelectItem>
              <SelectItem value="price">{t("sortOptions.price")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <Label className="mb-2" htmlFor="order">
            {t("orderLabel")}
          </Label>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger>
              <SelectValue placeholder={t("orderLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                {t(`orderOptions.${sort}.asc`)}
              </SelectItem>
              <SelectItem value="desc">
                {t(`orderOptions.${sort}.desc`)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleApplyFilter}>{t("apply-filters")}</Button>
    </div>
  );
}

export default FilterAds;
