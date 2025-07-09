import React from "react";
import { useTranslations } from "next-intl";
import { FormItem, FormControl, FormMessage } from "@/components/ui/form";
import CategoryChooseStepperMobile from "../category-choose-stepper-mobile";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { adSchemaClient } from "@/schema/ad";

interface Step1CategoryProps {
  form: UseFormReturn<z.infer<typeof adSchemaClient>, any, undefined>;
  onNext: () => void;
}

function Step1Category({ form, onNext }: Step1CategoryProps) {
  const tSell = useTranslations("/sell");

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold sm:text-2xl">
          {tSell("step1.title")}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          {tSell("step1.description")}
        </p>
      </div>

      <FormItem className="space-y-3">
        <FormControl>
          <CategoryChooseStepperMobile
            onChoice={(chosenCategory) => {
              form.setValue("categoryId", chosenCategory.id);
              onNext();
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}

export default Step1Category;
