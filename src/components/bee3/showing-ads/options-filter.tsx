"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RangeFilter from "./range-filter";
import { categoriesTree } from "@/schema/categories-tree";
import { parseRangeValue, formatRangeValue } from "@/lib/utils";
import {
  getApplicableAttributes,
  findAncestorCategories,
  getCategoryByPath,
} from "@/lib/category";

type Props = {
  categoryPath: string[];
  attributeFilters: Record<string, string>;
  onAttributeFiltersChange: (filters: Record<string, string>) => void;
};

function OptionsFilter({
  categoryPath,
  attributeFilters,
  onAttributeFiltersChange,
}: Props) {
  const tCategory = useTranslations("category");

  const category = getCategoryByPath(categoryPath?.join("/"));

  if (!category) return null;

  // Get applicable attributes (including inherited ones)
  const ancestorCategories = findAncestorCategories(
    category.id,
    categoriesTree,
  );
  const attributes = getApplicableAttributes(category, ancestorCategories);

  if (attributes.length === 0) return null;

  const handleAttributeChange = (attributeName: string, value: string) => {
    const newFilters = { ...attributeFilters };

    if (value && value.trim() !== "" && value !== "__all__") {
      newFilters[attributeName] = value;
    } else {
      delete newFilters[attributeName];
    }

    onAttributeFiltersChange(newFilters);
  };

  const handleRangeChange = (
    attributeName: string,
    min: number | undefined,
    max: number | undefined,
  ) => {
    const rangeValue = formatRangeValue(min, max);
    handleAttributeChange(attributeName, rangeValue);
  };

  return (
    <div className="flex flex-col gap-3">
      {attributes.map((attribute) => (
        <div key={attribute.name} className="flex flex-col">
          <Label className="mb-2" htmlFor={attribute.name}>
            {tCategory(`options.attributes.${attribute.name}`) ||
              attribute.name
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            {attribute.unit && ` (${attribute.unit})`}
          </Label>

          {attribute.type === "select" ? (
            <Select
              value={attributeFilters[attribute.name] || "__all__"}
              onValueChange={(value) =>
                handleAttributeChange(attribute.name, value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    tCategory(`options.placeholders.${attribute.name}`) ||
                    tCategory("options.select-placeholder").replace(
                      "{attribute}",
                      tCategory(`options.attributes.${attribute.name}`) ||
                        attribute.name.replace(/_/g, " "),
                    )
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">
                  {tCategory("options.all") || "All"}
                </SelectItem>
                {attribute.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {tCategory(`options.values.${option}`) || option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : attribute.type === "number" ? (
            (() => {
              const { min, max } = parseRangeValue(
                attributeFilters[attribute.name] || "",
              );
              return (
                <RangeFilter
                  label=""
                  minValue={min}
                  maxValue={max}
                  onMinChange={(minValue) =>
                    handleRangeChange(attribute.name, minValue, max)
                  }
                  onMaxChange={(maxValue) =>
                    handleRangeChange(attribute.name, min, maxValue)
                  }
                  id={attribute.name}
                />
              );
            })()
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default OptionsFilter;
