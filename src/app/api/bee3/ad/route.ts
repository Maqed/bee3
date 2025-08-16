import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { getUserById } from "@/database/users";
import { adSchemaServer } from "@/schema/ad";
import { db } from "@/server/db";
import { AD_STATUS } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { cities } from "@/schema/cities";
import { sendDiscordMessage } from "@/server/discord";
import { governorates } from "@/schema/governorates";
import { revalidateTag } from "next/cache";
import { generateAdCacheTag } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "must-be-logged-in" });

  // if (!user.phoneNumber || !user.phoneNumberVerified)
  // return NextResponse.json({ error: "must-have-phone-number" });

  if (!user.contactMethod)
    return NextResponse.json({ error: "must-have-contact-method" });

  const req = adSchemaServer.safeParse(await request.json());
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

  let updatedCount = tokenStore!.count;
  let updatedRefreshTime = tokenStore!.nextRefreshTime;

  if (
    tokenStore!.refreshInDays !== 0 &&
    tokenStore!.nextRefreshTime.getDate() <= Date.now()
  ) {
    updatedCount = tokenStore!.initialCount;
    updatedRefreshTime = new Date(
      Date.now() + tokenStore!.refreshInDays * 24 * 60 * 60 * 1000,
    );
  }

  if (updatedCount === 0)
    return NextResponse.json(
      { error: "failed-not-enough-tokens" },
      { status: 500 },
    );

  updatedCount--;

  await db.adTokenStore.update({
    where: {
      userId_tokenType: {
        userId: user.id,
        tokenType: "Free",
      },
    },
    data: {
      count: updatedCount,
      nextRefreshTime: updatedRefreshTime,
    },
  });

  // Create the ad id
  const adId = `${req.data.title
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FFa-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}-${createId()}`;

  // Parse category options
  const categoryOptions = req.data.categoryOptions
    ? JSON.parse(req.data.categoryOptions)
    : {};

  // Send Discord notification for admin review and get messageId first
  const city = cities.find((c) => c.id === req.data.cityId);
  const governorate = governorates.find((g) => g.id === city?.governorate_id);
  const messageId = await sendDiscordMessage({
    username: req.data.userName || user.name || "Unknown User",
    email: user.email || "",
    message: req.data.description || "",
    type: "Ad Request",
    dp: undefined, // Optionally add user image if available
    title: req.data.title,
    description: req.data.description || "",
    price: req.data.price,
    negotiable: req.data.negotiable,
    images: req.data.images,
    category: req.data.categoryId,
    city: city?.city_name_en || req.data.cityId.toString(),
    governorate:
      governorate?.governorate_name_en ||
      (city?.governorate_id ? city.governorate_id.toString() : ""),
  });

  // Create ad in a transaction to ensure all related data is created
  const ad = await db.$transaction(async (tx) => {
    // Create the ad first
    const newAd = await tx.ad.create({
      data: {
        id: adId,
        adStatus: AD_STATUS.PENDING, // All new ads start as PENDING
        title: req.data.title,
        description: req.data.description,
        price: req.data.price,
        negotiable: req.data.negotiable,
        images: {
          create: req.data.images.map((image) => ({ url: image })),
        },
        user: { connect: { id: user.id } },
        city: { connect: { id: req.data.cityId } },
        governorate: {
          connect: {
            id: cities.find((c) => c.id === req.data.cityId)!.governorate_id,
          },
        },
        category: { connect: { id: req.data.categoryId } },
        analytics: { create: { views: 0, uniqueViews: 0 } },
        discordMessageId: messageId || undefined,
      },
    });

    // Now create attribute values for the ad
    if (Object.keys(categoryOptions).length > 0) {
      // Get all attributes for this category
      const attributes = await tx.categoryAttribute.findMany({
        where: {
          categoryId: req.data.categoryId,
        },
      });

      // Create attribute values for each option
      for (const [attrName, attrValue] of Object.entries(categoryOptions)) {
        const attribute = attributes.find((attr) => attr.name === attrName);

        if (attribute) {
          await tx.attributeValue.create({
            data: {
              value:
                typeof attrValue === "string"
                  ? attrValue
                  : JSON.stringify(attrValue),
              attribute: {
                connect: { id: attribute.id },
              },
              ad: {
                connect: { id: newAd.id },
              },
            },
          });
        }
      }
    }

    return newAd;
  });
  revalidateTag(generateAdCacheTag(ad.id));
  // Return the created ad (still pending)
  return NextResponse.json({ result: ad });
}
