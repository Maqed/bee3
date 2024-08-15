"use server";
import { getServerAuthSession } from "@/server/auth";
import type { z } from "zod";
import type { userSettingsSchema } from "@/zod/user-settings";
import { db } from "@/server/db";

export async function deleteAccountAction() {
  const session = await getServerAuthSession();
  if (!session) return { error: "must-be-logged-in" };
  await db.user.delete({ where: { id: session.user.id } });
  return { message: "deleted" };
}

export async function updateUserAction(
  values: z.infer<typeof userSettingsSchema>,
) {
  const session = await getServerAuthSession();
  if (!session) return { error: "must-be-logged-in" };
  const user = await getUserById(session.user.id);
  if (!user) return { error: "must-be-logged-in" };

  if (user.updatedAt) {
    // Force the user to update their profile every 1 minute
    const timePassedSinceLastUpdateInSeconds =
      (new Date().getTime() - new Date(user.updatedAt).getTime()) / 3600;
    const isUserAbleToUpdate = timePassedSinceLastUpdateInSeconds > 60;
    if (!isUserAbleToUpdate) return { error: "please-wait" };
  }

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      ...values,
    },
  });
  return { message: "updated" };
}

export async function getUserById(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      sellerData: true,
    }
  });
  return user;
}
