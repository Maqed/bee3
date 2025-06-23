"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoriesTree } from "@/schema/categories-tree";
import { getApplicableAttributes, findAncestorCategories } from "@/schema/ad";
import { toPathFormat } from "@/lib/utils";

type CategoryInfo = {
  category: string;
  subCategory?: string;
};

type Props = {
  categoryInfo: CategoryInfo;
  attributeFilters: Record<string, string>;
  onAttributeFiltersChange: (filters: Record<string, string>) => void;
};

function OptionsFilter({
  categoryInfo,
  attributeFilters,
  onAttributeFiltersChange,
}: Props) {
  const tCategory = useTranslations("category");

  // Find the category from the tree based on path
  const findCategoryFromPath = (categoryInfo: CategoryInfo) => {
    // First find the main category
    const mainCategory = categoriesTree.find(
      (cat) => toPathFormat(cat.name) === categoryInfo.category,
    );

    if (!mainCategory) return null;

    // If there's a subcategory, find it
    if (categoryInfo.subCategory && mainCategory.categories) {
      const subCategory = mainCategory.categories.find(
        (subCat) => toPathFormat(subCat.name) === categoryInfo.subCategory,
      );
      return subCategory || mainCategory;
    }

    return mainCategory;
  };

  const category = findCategoryFromPath(categoryInfo);

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

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-base font-semibold">
        {tCategory("options.label")}
      </Label>

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
            <div className="flex items-center gap-2">
              <NumberInput
                value={
                  attributeFilters[attribute.name]?.includes("-")
                    ? Number(attributeFilters[attribute.name]?.split("-")[0])
                    : attributeFilters[attribute.name]
                      ? Number(attributeFilters[attribute.name])
                      : undefined
                }
                placeholder={`${tCategory("options.min")} ${attribute.unit || ""}`}
                onValueChange={(value) => {
                  const currentFilter = attributeFilters[attribute.name];
                  const maxValue = currentFilter?.includes("-")
                    ? currentFilter.split("-")[1]
                    : "";

                  if (value !== undefined) {
                    const newValue = maxValue
                      ? `${value}-${maxValue}`
                      : value.toString();
                    handleAttributeChange(attribute.name, newValue);
                  } else if (maxValue) {
                    handleAttributeChange(attribute.name, `-${maxValue}`);
                  } else {
                    handleAttributeChange(attribute.name, "");
                  }
                }}
                decimalScale={2}
                fixedDecimalScale={false}
                min={0}
              />
              <span className="text-muted-foreground">
                {tCategory("options.to")}
              </span>
              <NumberInput
                value={
                  attributeFilters[attribute.name]?.includes("-")
                    ? Number(attributeFilters[attribute.name]?.split("-")[1])
                    : undefined
                }
                placeholder={`${tCategory("options.max")} ${attribute.unit || ""}`}
                onValueChange={(value) => {
                  const currentFilter = attributeFilters[attribute.name];
                  const minValue = currentFilter?.includes("-")
                    ? currentFilter.split("-")[0]
                    : currentFilter || "";

                  if (value !== undefined) {
                    const newValue = minValue
                      ? `${minValue}-${value}`
                      : `-${value}`;
                    handleAttributeChange(attribute.name, newValue);
                  } else if (minValue) {
                    handleAttributeChange(attribute.name, minValue);
                  } else {
                    handleAttributeChange(attribute.name, "");
                  }
                }}
                decimalScale={2}
                fixedDecimalScale={false}
                min={0}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default OptionsFilter;
