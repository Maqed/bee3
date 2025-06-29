import type { UseFormReturn } from "react-hook-form";
import { categoriesTree } from "@/schema/categories-tree";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import {
  findCategory,
  getApplicableAttributes,
  findAncestorCategories,
} from "@/lib/category";
import { useTranslations } from "next-intl";

interface CategoryOptionsSectionProps {
  form: UseFormReturn<any>;
  categoryId: number;
  isPending: boolean;
  tSell: any;
}

function CategoryOptionsSection({
  form,
  categoryId,
  isPending,
  tSell,
}: CategoryOptionsSectionProps) {
  const tCategory = useTranslations("category");

  // Get the category and its attributes
  const category = findCategory(categoryId, categoriesTree);
  if (!category) return null;

  const ancestorCategories = findAncestorCategories(categoryId, categoriesTree);
  const attributes = getApplicableAttributes(category, ancestorCategories);

  if (attributes.length === 0) return null;

  // Parse current category options
  const currentOptions = (() => {
    try {
      return form.watch("categoryOptions")
        ? JSON.parse(form.watch("categoryOptions"))
        : {};
    } catch {
      return {};
    }
  })();

  const updateCategoryOptions = (attributeName: string, value: any) => {
    const newOptions = { ...currentOptions, [attributeName]: value };
    form.setValue("categoryOptions", JSON.stringify(newOptions));
  };

  return (
    <div className="space-y-4">
      <FormLabel className="text-base">{tCategory("options.label")}</FormLabel>
      {attributes.map((attribute) => (
        <FormItem key={attribute.name}>
          <FormLabel>
            {tCategory(`options.attributes.${attribute.name}`) ||
              attribute.name
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            {attribute.required && " *"}
            {attribute.unit && ` (${attribute.unit})`}
          </FormLabel>
          <FormControl>
            {attribute.type === "select" ? (
              <Select
                value={currentOptions[attribute.name] || ""}
                onValueChange={(value) =>
                  updateCategoryOptions(attribute.name, value)
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={tCategory("options.placeholders.choose")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {attribute.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {tCategory(`options.values.${option}`) || option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : attribute.type === "number" ? (
              <NumberInput
                value={currentOptions[attribute.name]}
                placeholder={
                  tCategory(`options.placeholders.${attribute.name}`) ||
                  tCategory("options.number-placeholder").replace(
                    "{attribute}",
                    tCategory(`options.attributes.${attribute.name}`) ||
                      attribute.name.replace(/_/g, " "),
                  )
                }
                onValueChange={(value) =>
                  updateCategoryOptions(attribute.name, value)
                }
                decimalScale={2}
                fixedDecimalScale={false}
                min={0}
                disabled={isPending}
              />
            ) : null}
          </FormControl>
        </FormItem>
      ))}
    </div>
  );
}

export default CategoryOptionsSection;
