import { type Ad as PrismaAd, Image as PrismaImage } from "@prisma/client";

export type Ad = PrismaAd & { images: PrismaImage[] };
