"use server";
import { getServerAuthSession } from "@/server/auth";
import type { z } from "zod";
import type { userSettingsSchema } from "@/schemas/user-settings";
import { db } from "@/server/db";

export async function deleteAccountAction() {
  const session = await getServerAuthSession();
  if (!session) return { error: "must-be-logged-in-message" };
  await db.user.delete({ where: { id: session.user.id } });
  return { message: "deleted-message" };
}

export async function updateUserAction(
  values: z.infer<typeof userSettingsSchema>,
) {
  const session = await getServerAuthSession();
  if (!session) return { error: "must-be-logged-in-message" };
  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      ...values,
    },
  });
  return { message: "updated-message" };
}
