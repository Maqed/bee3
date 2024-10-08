import { z } from "zod";


export const userSettingsSchema = z.object({
  name: z.string().min(2,{message:"settings.name.invalid"}),
  bio: z.string().max(2048, {message:"settings.bio.invalid"}).optional(),
});