import type { Ad } from "@prisma/client";
export type AdWithUser = Ad & {
  user: { id: string; name: string; createdAt: Date; phoneNumber: string };
};
