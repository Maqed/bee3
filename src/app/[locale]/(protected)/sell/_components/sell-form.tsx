import type React from "react";
import type { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { useState } from "react";

import { useTranslations, useLocale } from "next-intl";
import { categoriesTree } from "@/schema/categories-tree";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { UploadAdImageButton } from "@/components/bee3/ad-image-button";
import Spinner from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { getCategoryName, toPathFormat } from "@/lib/utils";
import { NumberInput } from "@/components/ui/number-input";
import { authClient } from "@/lib/auth-client";
import UserPhoneButton from "@/components/auth/user-phone-button/user-phone-button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UseFormReturn } from "react-hook-form";
import type { adSchemaClient } from "@/schema/ad";
import type { z } from "zod";
import { uploadToR2 } from "@/lib/s3";
import LocationCombobox from "@/components/bee3/location-combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import PrefixLabelledInput from "@/components/ui/prefix-labelled-input";
import { RadioGroup } from "@/components/ui/radio-group";
import CategoryRadioItem from "./category-radio-item";
import { categoryIcons, CategoryIconType } from "@/consts/category-icons";

type SellFormProps = {
  startTransition: TransitionStartFunction;
  isPending: boolean;
  selectedMainCategory: string | null;
  setSelectedMainCategory: Dispatch<SetStateAction<string | null>>;
  form: UseFormReturn<
    {
      title: string;
      price: number;
      categoryId: number;
      images: File[];
      negotiable: boolean;
      governorateId: number;
      cityId: number;
      description?: string | undefined;
    },
    any,
    undefined
  >;
};

function SellForm({
  startTransition,
  isPending,
  form,
  selectedMainCategory,
  setSelectedMainCategory,
}: SellFormProps) {
  const tSell = useTranslations("/sell");
  const tErrors = useTranslations("errors./sell");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [isSelectedALocation, setIsSelectedLocation] = useState(false);

  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );
  type SellFormType = z.infer<typeof adSchemaClient>;
  const onSubmit = async (data: SellFormType) => {
    if (!session?.user.phoneNumber || !session?.user.phoneNumberVerified) {
      toast({
        title: tErrors(`submit.must-have-phone-number.title`),
        description: tErrors(`submit.must-have-phone-number.description`),
        variant: "destructive",
      });
      return;
    }
    toast({
      title: tSell("toast.loading.title"),
      description: tSell("toast.loading.description"),
      variant: "info",
    });

    startTransition(async () => {
      try {
        const formData = new FormData();
        const images = await uploadToR2(data.images);
        formData.append(
          "json",
          JSON.stringify({
            ...data,
            images,
          }),
        );

        const response = await fetch("/api/bee3/ad", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (!result.error) {
          toast({
            title: tSell("toast.submit-success"),
            variant: "success",
          });
          form.reset();
          router.push(`/ad/${result.result.id}`);
          router.refresh();
        } else {
          toast({
            title: tErrors(`submit.${result.error}.title`),
            description: tErrors(`submit.${result.error}.description`),
            variant: "destructive",
          });
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: tErrors("submit-error"),
          variant: "destructive",
        });
      }
    });
  };
  const mainCategories = categoriesTree;
  const subCategories = selectedMainCategory
    ? mainCategories.find(
        (category) => category.name_en === selectedMainCategory,
      )?.categories || []
    : [];

  const onImagesChange = (newImages: File[]) => {
    form.setValue("images", newImages); // Update form state with new images
  };
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.target === event.currentTarget) {
      event.preventDefault();
    }
  };
  return (
    <main className="container my-4 sm:mx-auto md:max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>{tSell("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onKeyDown={handleKeyDown}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormItem className="space-y-3">
                <FormLabel>{tSell("category.main.label")}</FormLabel>
                <RadioGroup
                  onValueChange={(value) => {
                    setSelectedMainCategory(value);
                    setSelectedSubCategory(null);
                    form.setValue("categoryId", 0);
                  }}
                  className="flex gap-3"
                >
                  {mainCategories.map((category) => {
                    const categoryName = getCategoryName(locale, category);
                    const categoryNamePathFormat = toPathFormat(
                      category.name_en,
                    );
                    const CategoryIcon = categoryIcons[categoryNamePathFormat]
                      ?.icon as CategoryIconType;
                    return (
                      <FormItem
                        key={categoryName}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <CategoryRadioItem
                            Icon={CategoryIcon}
                            value={category.name_en}
                            categoryName={categoryName}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
                <FormMessage />
              </FormItem>
              {selectedMainCategory && (
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSell("category.sub.label")}</FormLabel>
                      <Select>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(Number(value));
                            }}
                            disabled={isPending}
                            className="flex gap-3"
                          >
                            {subCategories.map((subCategory) => {
                              const subCategoryName = getCategoryName(
                                locale,
                                subCategory,
                              );
                              const categoryNamePathFormat =
                                toPathFormat(selectedMainCategory);
                              const subCategoryNamePathFormat = toPathFormat(
                                subCategory.name_en,
                              );
                              const SubCategoryIcon = categoryIcons[
                                categoryNamePathFormat
                              ]?.subCategories[
                                subCategoryNamePathFormat
                              ] as CategoryIconType;
                              return (
                                <FormItem
                                  key={subCategoryName}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <CategoryRadioItem
                                    Icon={SubCategoryIcon}
                                    // @ts-ignore
                                    value={subCategory.id}
                                    categoryName={subCategoryName}
                                  />
                                </FormItem>
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Separator />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSell("images.label")}</FormLabel>
                    <FormControl>
                      <UploadAdImageButton
                        disabled={isPending}
                        images={form.getValues("images")}
                        onImagesChange={onImagesChange}
                      />
                    </FormControl>

                    <FormDescription>
                      {tSell("images.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              {/* LOCATIONS START */}
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
                            console.log({ newGovernorate, newCity });
                            setIsSelectedLocation(true);
                          }}
                          hasAll={false}
                        />
                      </FormControl>
                      <FormDescription>
                        {tSell("location.location.description")}
                      </FormDescription>
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
                        <FormLabel>
                          {tSell("location.governorate.label")}
                        </FormLabel>
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
                        <FormDescription>
                          {tSell("location.governorate.description")}
                        </FormDescription>
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
                            showCitiesOfGovernorate={form.getValues(
                              "governorateId",
                            )}
                          />
                        </FormControl>
                        <FormDescription>
                          {tSell("location.city.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {/* LOCATIONS END */}
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
                              value={field.value}
                              placeholder={tSell("price.placeholder")}
                              className="peer ps-11"
                              thousandSeparator=","
                              onValueChange={(value) => {
                                field.onChange(value);
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
                    <FormItem className="mt-8 flex items-center justify-center gap-1 self-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {tSell("negotiable")}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <FormItem className="flex flex-col gap-3">
                <FormLabel className="text-base">
                  {tSell("user-phone-button.label")}
                </FormLabel>
                <FormControl>
                  {isSessionPending ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <UserPhoneButton
                      id="phoneNumber"
                      value={session?.user.phoneNumber?.slice(3)}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
              <Button type="submit" disabled={isPending || isSessionPending}>
                {isPending ? (
                  <>
                    <Spinner className="me-1" />
                    {tSell("loading")}
                  </>
                ) : (
                  tSell("submit")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

export default SellForm;
