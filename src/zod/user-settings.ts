import { z } from "zod";

export const userSettingsSchemaIntl = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(2, { message: t("settings.name.invalid") }),
    bio: z
      .string()
      .max(2048, { message: t("settings.bio.invalid") })
      .optional(),
  });
export const userSettingsSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(2048).optional(),
});
