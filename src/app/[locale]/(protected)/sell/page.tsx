"use client";
import React from "react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { adSchema } from "@/schema/ad";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { UploadAdImageButton } from "@/components/bee3/ad-image-button";
import Spinner from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  ComboBox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
} from "@/components/ui/combobox";
import { CheckIcon } from "lucide-react";
import { governorates } from "@/schema/governorates";
import { cities } from "@/schema/cities";

function SellPage() {
  const tSell = useTranslations("/sell");
  const tCategories = useTranslations("categories");
  const tErrors = useTranslations("errors.sell");
  const locale = useLocale();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(null);
  const [isPending, startTransition] = useTransition();

  type FormData = z.infer<typeof adSchema>;
  const form = useForm<FormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      categoryPath: "",
      images: [],
      governorateId: 0,
      cityId: 0,
      negotiable: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append(
          "json",
          JSON.stringify({
            title: data.title,
            description: data.description,
            price: data.price,
            categoryPath: data.categoryPath,
            negotiable: data.negotiable,
          }),
        );

        data.images.forEach((image) => {
          formData.append("images", image);
        });

        const response = await fetch("/api/bee3/ad", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!result.error) {
          toast({
            title: tSell("submit-success"),
            variant: "default",
          });
          form.reset();
          router.push(`/ad/${result.result.id}`);
        } else {
          toast({
            title: tErrors(`submit.${result.error}.title`),
            description: tSell(`submit.${result.error}.description`),
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: tErrors("submit-error"),
          variant: "destructive",
        });
      }
    });
  };
  const mainCategories = categoriesTree.categories;
  const subCategories = selectedMainCategory
    ? mainCategories.find((category) => category.name === selectedMainCategory)
        ?.categories || []
    : [];

  const onImagesChange = (newImages: File[]) => {
    form.setValue("images", newImages); // Update form state with new images
  };

  return (
    <main className="container mt-4 sm:mx-auto md:max-w-4xl">
      <h1 className="mb-4 text-2xl font-bold">{tSell("title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormItem>
            <FormLabel>{tSell("category.main.label")}</FormLabel>
            <Select
              onValueChange={(value) => {
                setSelectedMainCategory(value);
                form.setValue("categoryPath", "");
              }}
              disabled={isPending}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={tSell("category.main.placeholder")}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mainCategories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {tCategories(`${category.name}.name`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>

          {selectedMainCategory && (
            <FormField
              control={form.control}
              name="categoryPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSell("category.sub.label")}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      return field.onChange(value);
                    }}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={tSell("category.sub.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subCategories.map((subCategory) => (
                        <SelectItem
                          key={subCategory.name}
                          value={`${selectedMainCategory}/${subCategory.name}`}
                        >
                          {tCategories(
                            `${selectedMainCategory}.categories.${subCategory.name}.name`,
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
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
                    onImagesChange={onImagesChange}
                  />
                </FormControl>

                <FormDescription>{tSell("images.description")}</FormDescription>
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

          <FormField
            control={form.control}
            name="governorateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSell("location.governorate.label")}</FormLabel>
                <FormControl>
                  <ComboBox
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("cityId", 0);
                      console.log(form.getValues());
                    }}
                    filterItems={(inputValue, items) =>
                      items.filter(({ value }) => {
                        const governorate = governorates.find(
                          (governorate) => governorate.id === value,
                        );
                        if (!governorate) return <></>;
                        const { governorate_name_ar, governorate_name_en } =
                          governorate;
                        const label =
                          locale === "ar"
                            ? governorate_name_ar
                            : governorate_name_en;
                        return (
                          !inputValue ||
                          (governorate &&
                            label
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()))
                        );
                      })
                    }
                  >
                    <ComboboxInput
                      placeholder={tSell("location.governorate.placeholder")}
                    />
                    <ComboboxContent>
                      {governorates.map(
                        ({ id, governorate_name_ar, governorate_name_en }) => {
                          const label =
                            locale === "ar"
                              ? governorate_name_ar
                              : governorate_name_en;
                          return (
                            <ComboboxItem
                              key={`governorate-${id}`}
                              value={id}
                              label={label}
                              className="ps-8"
                            >
                              <span className="text-sm text-foreground">
                                {label}
                              </span>
                              {field.value === id && (
                                <span className="absolute start-2 top-0 flex h-full items-center justify-center">
                                  <CheckIcon className="size-4" />
                                </span>
                              )}
                            </ComboboxItem>
                          );
                        },
                      )}
                      <ComboboxEmpty>
                        {tSell("location.no-results")}
                      </ComboboxEmpty>
                    </ComboboxContent>
                  </ComboBox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.getValues().governorateId !== 0 && (
            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSell("location.city.label")}</FormLabel>
                  <FormControl>
                    <ComboBox
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(value);

                        console.log(form.getValues());
                      }}
                      filterItems={(inputValue, items) =>
                        items.filter(({ value }) => {
                          const city = cities.find((city) => city.id === value);
                          if (!city) return <></>;
                          const { city_name_ar, city_name_en } = city;
                          const label =
                            locale === "ar" ? city_name_ar : city_name_en;
                          return (
                            !inputValue ||
                            (city &&
                              label
                                .toLowerCase()
                                .includes(inputValue.toLowerCase()))
                          );
                        })
                      }
                    >
                      <ComboboxInput
                        placeholder={tSell("location.city.placeholder")}
                      />
                      <ComboboxContent>
                        {cities
                          .filter(
                            (city) =>
                              city.governorate_id ===
                              form.getValues().governorateId,
                          )
                          .map(({ id, city_name_ar, city_name_en }) => {
                            const label =
                              locale === "ar" ? city_name_ar : city_name_en;
                            return (
                              <ComboboxItem
                                key={`city-${id}`}
                                value={id}
                                label={label}
                                className="ps-8"
                              >
                                <span className="text-sm text-foreground">
                                  {label}
                                </span>
                                {field.value === id && (
                                  <span className="absolute start-2 top-0 flex h-full items-center justify-center">
                                    <CheckIcon className="size-4" />
                                  </span>
                                )}
                              </ComboboxItem>
                            );
                          })}
                        <ComboboxEmpty>
                          {tSell("location.no-results")}
                        </ComboboxEmpty>
                      </ComboboxContent>
                    </ComboBox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Separator />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSell("price.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={tSell("price.placeholder")}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    disabled={isPending}
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {tSell("negotiable.label")}
                  </FormLabel>
                  <FormDescription>
                    {tSell("negotiable.description")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
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
    </main>
  );
}

export default SellPage;
