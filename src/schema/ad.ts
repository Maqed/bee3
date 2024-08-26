import { z } from "zod";
import { AdTiers } from "@prisma/client";
import { categoriesTree, type CategoryTreeItem } from "./categories-tree";

export const adSchema = z.object({
  tier: z.nativeEnum(AdTiers),
  title: z.string().min(4),
  description: z.string().min(50),
  price: z.number().min(1),
  categoryPath: z
    .string()
    .regex(/^[\w\s]+(\/[\w\s]+)*$/, { message: "Invalid category path format" })
    .refine((path) => validateCategoryPath(path), {
      message: "Invalid category path",
    }),
  tags: z.array(z.string()).min(3),
  images: z.array(z.string()).min(1),
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
