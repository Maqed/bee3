"use client";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { useTranslations } from "next-intl";

type RangeFilterProps = {
  label: string;
  minValue?: number;
  maxValue?: number;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  thousandSeparator?: string;
  id?: string;
};

function RangeFilter({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  thousandSeparator = ",",
  id = "range-filter",
}: RangeFilterProps) {
  const tCategory = useTranslations("category");
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <div className="flex items-center justify-between gap-3">
        <NumberInput
          id={`${id}-min`}
          thousandSeparator={thousandSeparator}
          value={minValue}
          onValueChange={(value) => {
            onMinChange(value ? value : undefined);
          }}
          placeholder={tCategory("options.from")}
        />
        <NumberInput
          id={`${id}-max`}
          thousandSeparator={thousandSeparator}
          value={maxValue}
          onValueChange={(value) => {
            onMaxChange(value ? value : undefined);
          }}
          placeholder={tCategory("options.to")}
        />
      </div>
    </div>
  );
}

export default RangeFilter;
