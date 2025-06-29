import type React from "react";
import { useState } from "react";
import { useLocale } from "next-intl";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { UploadAdImageButton } from "@/components/bee3/ad-image-button";
import LocationCombobox from "@/components/bee3/location-combobox";
import PrefixLabelledInput from "@/components/ui/prefix-labelled-input";
import CategoryOptionsSection from "./category-options-section";
import { authClient } from "@/lib/auth-client";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { adSchemaClient } from "@/schema/ad";

interface Step3InformationProps {
  form: UseFormReturn<z.infer<typeof adSchemaClient>, any, undefined>;
  selectedSubCategory: string | null;
  isPending: boolean;
  tSell: any;
}

function Step3Information({
  form,
  selectedSubCategory,
  isPending,
  tSell,
}: Step3InformationProps) {
  const locale = useLocale();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [isSelectedALocation, setIsSelectedLocation] = useState(false);

  const onImagesChange = (newImages: File[]) => {
    form.setValue("images", newImages);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.target === event.currentTarget) {
      event.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">{tSell("step3.title")}</h2>
        <p className="text-muted-foreground">{tSell("step3.description")}</p>
      </div>

      <div className="space-y-8" onKeyDown={handleKeyDown}>
        {/* Images Section */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSell("images.label")}</FormLabel>
              <FormControl>
                <UploadAdImageButton
                  disabled={isPending}
                  images={form.watch("images")}
                  onImagesChange={onImagesChange}
                />
              </FormControl>
              <FormDescription>{tSell("images.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title Section */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSell("ad-title.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSell("ad-title.placeholder")}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Section */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSell("description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={tSell("description.placeholder")}
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Category Options Section */}
        {selectedSubCategory && form.watch("categoryId") > 0 && (
          <>
            <CategoryOptionsSection
              form={form}
              categoryId={form.watch("categoryId")}
              isPending={isPending}
              tSell={tSell}
            />
            <Separator />
          </>
        )}

        {!isSelectedALocation && (
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>{tSell("location.location.label")}</FormLabel>
                <FormControl>
                  <LocationCombobox
                    initialCity={form.getValues("cityId")}
                    initialGovernorate={form.getValues("governorateId")}
                    onLocationChange={(newGovernorate, newCity) => {
                      form.setValue("governorateId", newGovernorate);
                      form.setValue("cityId", newCity);
                      setIsSelectedLocation(true);
                    }}
                    hasAll={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isSelectedALocation && (
          <>
            <FormField
              control={form.control}
              name="governorateId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>{tSell("location.governorate.label")}</FormLabel>
                  <FormControl>
                    <LocationCombobox
                      initialGovernorate={form.getValues("governorateId")}
                      onLocationChange={(newGovernorate, newCity) => {
                        form.setValue("governorateId", newGovernorate);
                        form.setValue("cityId", newCity);
                        setIsSelectedLocation(true);
                      }}
                      hasAll={false}
                      showAllGovernorates={true}
                      showAllCities={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>{tSell("location.city.label")}</FormLabel>
                  <FormControl>
                    <LocationCombobox
                      initialCity={form.getValues("cityId")}
                      initialGovernorate={form.getValues("governorateId")}
                      onLocationChange={(newGovernorate, newCity) => {
                        form.setValue("governorateId", newGovernorate);
                        form.setValue("cityId", newCity);
                        setIsSelectedLocation(true);
                      }}
                      showAllGovernorates={false}
                      showCitiesOfGovernorate={form.getValues("governorateId")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Separator />

        <div className="flex h-full flex-wrap items-stretch gap-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>{tSell("price.label")}</FormLabel>
                <FormControl>
                  <PrefixLabelledInput
                    prefix={locale === "ar" ? "ج.م " : "EGP "}
                    input={
                      <NumberInput
                        value={form.watch("price")}
                        placeholder={tSell("price.placeholder")}
                        className="peer ps-11"
                        thousandSeparator=","
                        onValueChange={(value) => {
                          form.setValue("price", value ?? 0);
                        }}
                        disabled={isPending}
                      />
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="negotiable"
            render={({ field }) => (
              <FormItem className="mt-8 flex items-center justify-center gap-1 space-y-0 self-center">
                <FormControl>
                  <Checkbox
                    checked={form.watch("negotiable")}
                    onCheckedChange={(checked) =>
                      form.setValue("negotiable", Boolean(checked))
                    }
                    disabled={isPending}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {tSell("negotiable")}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Step3Information;
