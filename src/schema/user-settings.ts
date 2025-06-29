import { z } from "zod";

export const userSettingsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "/user-settings.name.invalid" })
    .max(20, { message: "/user-settings.name.invalid" }),
  bio: z.string().max(75, { message: "/user-settings.bio.invalid" }).optional(),
  contactInfo: z
    .string()
    .max(75, { message: "/user-settings.contact-info.invalid" })
    .optional(),
});
