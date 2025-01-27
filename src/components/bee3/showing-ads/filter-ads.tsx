"use client";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type Props = {
  onApplyFilter?: () => void;
};
function FilterAds({ onApplyFilter }: Props) {
  const t = useTranslations("filter-ads");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const priceRange = searchParams.get("price")?.split("-");
  const [min, max] = priceRange ? priceRange : [0, 9999999999];
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const [sort, setSort] = useState(searchParams.get("sort") ?? "date");
  const [order, setOrder] = useState(searchParams.get("order") ?? "desc");

  useEffect(() => {
    const priceRange = searchParams.get("price")?.split("-");
    const [min, max] = priceRange ? priceRange : [0, 9999999999];
    setMinPrice(min);
    setMaxPrice(max);
  }, [min, max]);

  function handleApplyFilter() {
    const queryParams = new URLSearchParams({
      sort,
      order,
      price: `${minPrice}-${maxPrice}`,
    });
    if (typeof searchParams.get("q") === "string")
      queryParams.set("q", searchParams.get("q") as string);

    router.push(`${pathname}?${queryParams.toString()}`);
    if (onApplyFilter) {
      onApplyFilter();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <Label className="mb-2" htmlFor="minPrice">
            {t("minPriceLabel")}
          </Label>
          <Input
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            type="number"
            placeholder="min price"
          />
        </div>
        <div className="flex flex-col">
          <Label className="mb-2" htmlFor="maxPrice">
            {t("maxPriceLabel")}
          </Label>
          <Input
            id="maxPrice"
            value={maxPrice}
            type="number"
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="max price"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <Label className="mb-2" htmlFor="sort">
          {t("sortByLabel")}
        </Label>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
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
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">{t(`orderOptions.${sort}.asc`)}</SelectItem>
            <SelectItem value="desc">
              {t(`orderOptions.${sort}.desc`)}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleApplyFilter}>{t("apply-filters")}</Button>
    </div>
  );
}

export default FilterAds;
