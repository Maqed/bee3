import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { getUserById } from "@/database/users";
import { adSchemaServer } from "@/schema/ad";
import { db } from "@/server/db";
import { createId } from "@paralleldrive/cuid2";
import { cities } from "@/schema/cities";

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "must-be-logged-in" });

  if (!user.phoneNumber || !user.phoneNumberVerified)
    return NextResponse.json({ error: "must-have-phone-number" });

  const formData = await request.formData();
  const jsonData = JSON.parse(formData.get("json") as string);

  const req = adSchemaServer.safeParse({ ...jsonData });
  if (!req.success)
    return NextResponse.json({ error: req.error }, { status: 500 });
  // Check token store and decrement token count
  const tokenStore = await db.adTokenStore.findUnique({
    where: {
      userId_tokenType: {
        userId: user.id,
        tokenType: "Free",
      },
    },
  });

  if (
    tokenStore!.refreshInDays != 0 &&
    tokenStore!.nextRefreshTime.getDate() <= Date.now()
  ) {
    tokenStore!.count = tokenStore!.initialCount;
  }

  if (tokenStore?.count === 0)
    return NextResponse.json(
      { error: "failed-not-enough-tokens" },
      { status: 500 },
    );

  const getRefreshTime = (days: number) => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + days);
    return date;
  };

  tokenStore!.count--;
  if (tokenStore!.refreshInDays != 0)
    tokenStore!.nextRefreshTime = getRefreshTime(tokenStore!.refreshInDays);

  await db.adTokenStore.update({
    where: {
      userId_tokenType: {
        userId: user.id,
        tokenType: "Free",
      },
    },
    data: {
      ...tokenStore,
    },
  });

  // Create ad
  const ad = await db.ad.create({
    data: {
      id: `${req.data.title
        .toLowerCase()
        .trim()
        .replace(/[^\u0600-\u06FFa-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}-${createId()}`,
      title: req.data.title,
      description: req.data.description,
      price: req.data.price,
      negotiable: req.data.negotiable,
      images: {
        create: req.data.images.map((image) => ({
          url: image,
        })),
      },

      user: {
        connect: { id: user.id },
      },
      city: {
        connect: { id: req.data.cityId },
      },
      governorate: {
        connect: {
          id: cities.find((c) => c.id === req.data.cityId)!.governorate_id,
        },
      },
      category: {
        connect: { id: req.data.categoryId },
      },
      analytics: {
        create: { views: 0, uniqueViews: 0 },
      },
    },
  });

  return NextResponse.json({ result: ad });
}
