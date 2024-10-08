import { z } from "zod";
import { categoriesTree, type CategoryTreeItem } from "./categories-tree";

// Update the error messages to use translation keys
export const adSchema = z.object({
  title: z
    .string()
    .min(1, { message: "sell.title.min" })
    .max(250, { message: "sell.title.max" }),
  description: z.string().max(2048, { message: "sell.description" }).optional(),
  price: z.number().min(0, { message: "sell.price" }),
  categoryPath: z
    .string()
    .regex(/^[\w-]+(\/[\w-]+)*$/, { message: "sell.categoryPath" })
    .refine((path) => validateCategoryPath(path), {
      message: "sell.categoryPath", // Keep as is
    }),
  images: z.array(z.instanceof(File)).min(1, { message: "sell.images" }),
  negotiable: z.boolean(),
});

const validateCategoryPath = (path: string): boolean => {
  const segments = path.split("/");

  let currentCategories = categoriesTree.categories as CategoryTreeItem[];
  for (const segment of segments) {
    const matchedCategory = currentCategories.find(
      (category) => category.name === segment,
    );
    if (!matchedCategory) {
      return false;
    }
    currentCategories = matchedCategory.categories ?? [];
  }
  return true;
};
