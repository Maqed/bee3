import { z } from "zod";
import { AdTiers } from "@prisma/client";
import { Categories } from "@prisma/client";

export const adSchema = z.object({
  tier: z.nativeEnum(AdTiers),
  title: z.string().min(4),
  description: z.string().min(50),
  price: z.number().min(1),
  category: z.nativeEnum(Categories),
  tags: z.array(z.string()).min(3),
  images: z.array(z.string()).min(1),
  negotiable: z.boolean()
});