import { z } from "zod";
import { AdTiers } from "@prisma/client";
import { categoriesTree, type CategoryTreeItem } from "./categories-tree";

export const adSchema = (t: (arg: string) => string) =>
  z.object({
    tier: z.nativeEnum(AdTiers),
    title: z.string().min(1, { message: t("errors.title") }),
    description: z.string().optional(),
    price: z.number().min(0, { message: t("errors.price") }),
    categoryPath: z
      .string()
      .regex(/^[\w\s]+(\/[\w\s]+)*$/, { message: t("errors.categoryPath") })
      .refine((path) => validateCategoryPath(path), {
        message: t("errors.categoryPath"),
      }),
    images: z.array(z.string().url()).min(1),
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
