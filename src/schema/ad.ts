import { z } from "zod";
import { categoriesTree, type CategoryTreeItem } from "./categories-tree";
import { cities } from "./cities";
import { governorates } from "./governorates";

const adSchemaMutual = {
  title: z
    .string()
    .min(1, { message: "/sell.title.min" })
    .max(250, { message: "/sell.title.max" }),
  description: z
    .string()
    .max(2048, { message: "/sell.description" })
    .optional(),
  price: z.number().min(0, { message: "/sell.price" }),
  categoryId: z.number().refine((id) => findCategoryById(id, categoriesTree), {
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
};
export const adSchemaServer = z.object({
  ...adSchemaMutual,
  images: z.array(z.string()).min(1, { message: "/sell.images" }),
});
export const adSchemaClient = z.object({
  ...adSchemaMutual,
  images: z.array(z.instanceof(File)).min(1, { message: "/sell.images" }),
});

export const favAdSchema = z.object({
  adId: z
    .string()
    .regex(
      /^[\u0600-\u06FFa-z0-9]+(?:-[\u0600-\u06FFa-z0-9]+)*-[a-z0-9]{24}$/,
      { message: "ad.id" },
    ),
  state: z.boolean(),
});

const findCategoryById = (
  id: number,
  categories: CategoryTreeItem[],
): boolean =>
  categories.some(
    (c) => c.id === id || (c.categories && findCategoryById(id, c.categories)),
  );
