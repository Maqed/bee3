import { z } from "zod";
import { categoriesTree, type CategoryTreeItem } from "./categories-tree";
import { cities } from "./cities";

// Update the error messages to use translation keys
export const adSchema = z.object({
  title: z
    .string()
    .min(1, { message: "sell.title.min" })
    .max(250, { message: "sell.title.max" }),
  description: z.string().max(2048, { message: "sell.description" }).optional(),
  price: z.number().min(0, { message: "sell.price" }),
  categoryId: z.number().refine((id) => findCategoryById(id, categoriesTree), { message: "sell.categoryId" }),
  images: z.array(z.instanceof(File)).min(1, { message: "sell.images" }),
  negotiable: z.boolean(),
  cityId: z.number().refine((id) => cities.some(c => c.id == id), { message: "sell.cityId" }),
});

export const favAdSchema = z.object({
  adId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]{24}$/, { message: "ad.id" }),
  state: z.boolean()
});

const findCategoryById = (id: number, categories: CategoryTreeItem[]): boolean =>
  categories.some(c => c.id === id || (c.categories && findCategoryById(id, c.categories)));