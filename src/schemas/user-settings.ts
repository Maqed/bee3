import { z } from "zod";

export const userSettingsSchemaIntl = (t: (arg: string) => string) =>
  z.object({
    name: z.string().min(2, { message: t("name-error") }),
  });
export const userSettingsSchema = z.object({
  name: z.string().min(2),
});
