import { z } from "zod";
import {
  categoriesTree,
  type CategoryTreeItem,
  type CategoryAttributeDefinition,
} from "./categories-tree";
import { cities } from "./cities";
import { governorates } from "./governorates";
import { MAX_AD_IMAGES, MAX_IMAGE_SIZE } from "@/consts/ad";
import { env } from "@/env";

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

    case "multiselect":
      if (!Array.isArray(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `/sell.categoryOptions-${key}-must-be-array`,
          path: ["categoryOptions"],
        });
      } else if (attribute.options) {
        // Check that all values are in the options list
        for (const item of value) {
          if (!attribute.options.includes(item)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `/sell.categoryOptions-${key}-invalid-option-${item}`,
              path: ["categoryOptions"],
            });
          }
        }
      }
      break;
  }
};

/**
 * Find all ancestor categories for a given category ID
 */
const findAncestorCategories = (
  categoryId: number,
  tree: CategoryTreeItem[] = categoriesTree,
  ancestors: CategoryTreeItem[] = [],
): CategoryTreeItem[] => {
  for (const category of tree) {
    if (category.id === categoryId) {
      return ancestors;
    }

    if (category.categories) {
      // Create a new array with the current category added to ancestors
      const newAncestors = [...ancestors, category];
      const result = findAncestorCategories(
        categoryId,
        category.categories,
        newAncestors,
      );
      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
};

/**
 * Gets all applicable attributes for a category, including inherited ones if appropriate
 */
const getApplicableAttributes = (
  category: CategoryTreeItem,
  ancestorCategories: CategoryTreeItem[] = [],
): CategoryAttributeDefinition[] => {
  let attributes: CategoryAttributeDefinition[] = [
    ...(category.attributes || []),
  ];

  // Add attributes from ancestors if inheritance is enabled
  if (
    category.inheritParentAttributes !== false &&
    ancestorCategories.length > 0
  ) {
    for (const ancestorCategory of ancestorCategories) {
      if (ancestorCategory.attributes) {
        // Add parent attributes, avoiding duplicates by name
        for (const parentAttr of ancestorCategory.attributes) {
          if (!attributes.some((a) => a.name === parentAttr.name)) {
            attributes.push(parentAttr);
          }
        }
      }
    }
  }

  return attributes;
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
  }),
  // User information fields
  userName: z
    .string()
    .min(2, { message: "/sell.user-name.min" })
    .max(20, { message: "/sell.user-name.max" })
    .optional(),
  userContactInfo: z
    .string()
    .max(75, { message: "/sell.user-contact-info.max" })
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
        z
          .instanceof(File)
          .refine((file) => file.size <= MAX_IMAGE_SIZE, {
            message: "/sell.image-size",
          })
          .refine((file) => file.type.startsWith("image/")),
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

/**
 * Checks if a category exists by ID
 */
const categoryExists = (id: number, categories: CategoryTreeItem[]): boolean =>
  categories.some(
    (c) => c.id === id || (c.categories && categoryExists(id, c.categories)),
  );

/**
 * Checks if a category exists by path
 */
const categoryPathExists = (
  path: string,
  categories: CategoryTreeItem[],
  basePath: string = "",
): boolean => {
  for (const category of categories) {
    const categoryPath = basePath
      ? `${basePath}/${toPathFormat(category.name)}`
      : toPathFormat(category.name);

    if (categoryPath === path) return true;

    if (
      category.categories &&
      categoryPathExists(path, category.categories, categoryPath)
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Finds a category by ID
 */
const findCategory = (
  id: number,
  categories: CategoryTreeItem[],
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

/**
 * Convert a string to a URL-friendly path format
 */
const toPathFormat = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FFa-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Export helper functions for use in components
export { findCategory, getApplicableAttributes, findAncestorCategories };
