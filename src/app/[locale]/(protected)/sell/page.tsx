"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { UploadButton } from "@/components/uploadthing/buttons";
import Image from "next/image";

function SellPage() {
  const t = useTranslations("sell");
  const { toast } = useToast();
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(null);

  const schema = adSchema(t);
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      categoryPath: "",
      images: [],
      negotiable: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/bee3/ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: t("errors.submit-success"),
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: t("errors.submit-error"),
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("errors.submit-error"),
        variant: "destructive",
      });
    }
  };
  const { setValue } = form;
  const mainCategories = categoriesTree.categories;
  const subCategories = selectedMainCategory
    ? mainCategories.find((category) => category.name === selectedMainCategory)
        ?.categories || []
    : [];

  return (
    <main className="container mt-4 sm:mx-auto md:max-w-4xl">
      <h1 className="mb-4 text-2xl font-bold">{t("title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="categoryPath"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category.main.label")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    setSelectedMainCategory(value);
                    console.log("#".repeat(10));
                    console.log("Category");
                    console.log(value);
                    console.log("#".repeat(10));
                    field.onChange(value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("category.main.placeholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mainCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {t(`category.options.${category.name}-category`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedMainCategory && (
            <FormField
              control={form.control}
              name="categoryPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category.sub.label")}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      console.log("#".repeat(10));
                      console.log("SubCategory");
                      console.log(value);
                      console.log("#".repeat(10));
                      return field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("category.sub.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subCategories.map((category) => (
                        <SelectItem
                          key={category.name}
                          value={`${selectedMainCategory}/${category.name}`}
                        >
                          {t(
                            `category.options.${selectedMainCategory}-subcategory.${category.name}`,
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

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("images.label")}</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange([
                          ...field.value,
                          ...res.map((file) => file.url),
                        ]);
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          title: t("errors.upload-error"),
                          description: error.message,
                          variant: "destructive",
                        });
                      }}
                    />
                  </FormControl>
                  {field.value.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value.map((url, index) => (
                        <Image
                          key={index}
                          src={url}
                          alt={`Uploaded preview ${index}`}
                          width={100}
                          height={100}
                          className="rounded-md"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <FormDescription>{t("images.description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("ad-title.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("ad-title.placeholder")} {...field} />
                </FormControl>
                <FormDescription>{t("ad-title.description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("description.placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("description.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("price.label")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t("price.placeholder")}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>{t("price.description")}</FormDescription>
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
                    {t("negotiable.label")}
                  </FormLabel>
                  <FormDescription>
                    {t("negotiable.description")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit">{t("submit")}</Button>
        </form>
      </Form>
    </main>
  );
}

export default SellPage;
