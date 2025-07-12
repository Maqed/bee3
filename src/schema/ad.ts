import { z } from "zod";
import {
  categoriesTree,
  type CategoryAttributeDefinition,
} from "./categories-tree";
import { cities } from "./cities";
import { governorates } from "./governorates";
import { MAX_AD_IMAGES } from "@/consts/ad";
import { env } from "@/env";
import {
  categoryExists,
  findCategory,
  findAncestorCategories,
  getApplicableAttributes,
} from "@/lib/category";

/**
 * Validates that the categoryOptions JSON contains valid attributes for the selected category
 */
const validateCategoryOptions = (data: any, ctx: z.RefinementCtx) => {
  if (!data.categoryOptions) return;

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
  if (!category) return;

  // Get all applicable attributes for this category (including inherited ones if applicable)
  const attributes = getApplicableAttributes(
    category,
    findAncestorCategories(data.categoryId, categoriesTree),
  );

  // Check that each provided option is a valid attribute for this category
  for (const key of Object.keys(optionsObj)) {
    const attribute = attributes.find((attr) => attr.name === key);
    if (!attribute) {
      console.log(`${key} not found in ${JSON.stringify(attributes)}`);
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `/sell.categoryOptions-invalid-attribute-${key}`,
        path: ["categoryOptions"],
      });
      continue;
    }

    // Validate the attribute value based on its type
    validateAttributeValue(key, optionsObj[key], attribute, ctx);
  }

  // Check for missing required attributes
  const requiredAttributes = attributes.filter((attr) => attr.required);
  for (const attr of requiredAttributes) {
    if (!(attr.name in optionsObj)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `/sell.categoryOptions-missing-required-${attr.name}`,
        path: ["categoryOptions"],
      });
    }
  }
};

/**
 * Validates a single attribute value based on its type
 */
const validateAttributeValue = (
  key: string,
  value: any,
  attribute: CategoryAttributeDefinition,
  ctx: z.RefinementCtx,
) => {
  switch (attribute.type) {
    case "number":
      if (typeof value !== "number") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `/sell.categoryOptions-${key}-must-be-number`,
          path: ["categoryOptions"],
        });
      }
      break;

    case "select":
      if (!attribute.options?.includes(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `/sell.categoryOptions-${key}-invalid-option`,
          path: ["categoryOptions"],
        });
      }
      break;
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
  categoryId: z.string().refine((id) => categoryExists(id, categoriesTree), {
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
  }),
  // User information fields
  userName: z
    .string()
    .min(2, { message: "/sell.user-name.min" })
    .max(20, { message: "/sell.user-name.max" })
    .optional(),
  userContactMethod: z
    .string()
    .max(75, { message: "/sell.user-contact-method.max" })
    .optional(),
};

export const adSchemaServer = z
  .object({
    ...adSchemaMutual,
    images: z
      .array(
        z
          .string()
          .refine(
            (url) =>
              url.startsWith(env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_BUCKET_URL),
            {
              message: "/sell.images-not-from-us",
            },
          ),
      )
      .min(1, { message: "/sell.images" })
      .max(MAX_AD_IMAGES, { message: "/sell.max-images" }),
  })
  .superRefine(validateCategoryOptions);

export const adSchemaClient = z
  .object({
    ...adSchemaMutual,
    images: z
      .array(
        z.instanceof(File).refine((file) => file.type.startsWith("image/")),
      )
      .min(1, { message: "/sell.images" })
      .max(MAX_AD_IMAGES, { message: "/sell.max-images" }),
  })
  .superRefine(validateCategoryOptions);

export const favAdSchema = z.object({
  adId: z
    .string()
    .regex(
      /^[\u0600-\u06FFa-z0-9]+(?:-[\u0600-\u06FFa-z0-9]+)*-[a-z0-9]{24}$/,
      { message: "ad.id" },
    ),
  state: z.boolean(),
});
