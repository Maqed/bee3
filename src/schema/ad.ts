import { z } from "zod";
import { categoriesTree, type CategoryTreeItem } from "./categories-tree";
import { cities } from "./cities";
import { governorates } from "./governorates";
import { MAX_AD_IMAGES, MAX_IMAGE_SIZE } from "@/consts/ad";
import { env } from "@/env";

const validateCategoryOptions = (data: any, ctx: z.RefinementCtx) => {
  if (!data.categoryOptions)
    return;
  let optionsObj: Record<string, any>;
  try {
    optionsObj = JSON.parse(data.categoryOptions);
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "/sell.categoryOptions-invalid-json",
      path: ["categoryOptions"],
    });
    return;
  }
  const category = findCategory(data.categoryId, categoriesTree);
  if (category && category.options) {
    for (const key of Object.keys(optionsObj)) {
      if (!(key in category.options)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "/sell.categoryOptions-invalid-option",
          path: ["categoryOptions"],
        });
      }
    }
  }
};

const adSchemaMutual = {
  title: z
    .string()
    .min(1, { message: "/sell.title.min" })
    .max(250, { message: "/sell.title.max" }),
  description: z
    .string()
    .max(2048, { message: "/sell.description" })
    .optional(),
  categoryOptions: z.string().optional(),
  price: z.number().min(0, { message: "/sell.price" }),
  categoryId: z.number().refine((id) => categoryExists(id, categoriesTree), {
    message: "/sell.categoryId",
  }),
  negotiable: z.boolean(),
  governorateId: z
    .number()
    .refine((id) => governorates.some((g) => g.id === id), {
      message: "/sell.governorateId",
    }),
  cityId: z.number().refine((id) => cities.some((c) => c.id === id), {
    message: "/sell.cityId",
  })
};

export const adSchemaServer = z.object({
  ...adSchemaMutual,
  images: z
    .array(
      z
        .string()
        .refine(
          (url) => url.startsWith(env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_BUCKET_URL),
          {
            message: "/sell.images-not-from-us",
          },
        ),
    )
    .min(1, { message: "/sell.images" })
    .max(MAX_AD_IMAGES, { message: "/sell.max-images" }),
}).superRefine(validateCategoryOptions);

export const adSchemaClient = z.object({
  ...adSchemaMutual,
  images: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_IMAGE_SIZE, {
          message: "/sell.image-size",
        })
        .refine((file) => file.type.startsWith("image/")),
    )
    .min(1, { message: "/sell.images" })
    .max(MAX_AD_IMAGES, { message: "/sell.max-images" }),
}).superRefine(validateCategoryOptions);

export const favAdSchema = z.object({
  adId: z
    .string()
    .regex(
      /^[\u0600-\u06FFa-z0-9]+(?:-[\u0600-\u06FFa-z0-9]+)*-[a-z0-9]{24}$/,
      { message: "ad.id" },
    ),
  state: z.boolean(),
});

const categoryExists = (
  id: number,
  categories: CategoryTreeItem[],
): boolean =>
  categories.some(
    (c) => c.id === id || (c.categories && categoryExists(id, c.categories)),
  );

const findCategory = (
  id: number,
  categories: CategoryTreeItem[]
): CategoryTreeItem | null => {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.categories) {
      const found = findCategory(id, cat.categories);
      if (found) return found;
    }
  }
  return null;
};