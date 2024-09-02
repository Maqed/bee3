import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/server/auth";
import { getUserById } from "@/actions/users";
import { adSchema } from "@/schema/ad";
import { db } from "@/server/db";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "must-be-logged-in" });

  const formData = await request.formData();
  const jsonData = JSON.parse(formData.get("json") as string);
  const imageFiles = formData.getAll("images") as File[];

  const req = adSchema.safeParse({ ...jsonData, images: imageFiles });
  if (!req.success) return NextResponse.json({ error: req.error });

  // Check token store and decrement token count
  const tokenStore = await db.adTokenStore.findUnique({
    where: {
      userId_tokenType: {
        userId: user.id,
        tokenType: "Free",
      },
    },
  });

  if (tokenStore?.count === 0)
    return NextResponse.json({ error: "failed-not-enough-tokens" }, { status: 500 });

  await db.adTokenStore.update({
    where: {
      userId_tokenType: {
        userId: user.id,
        tokenType: "Free",
      },
    },
    data: {
      count: { decrement: 1 },
    },
  });

  // Upload images
  const uploadedImages = await utapi.uploadFiles(imageFiles);
  const imageUrls = uploadedImages
    .map((img) => img.data?.url)
    .filter((img) => typeof img === "string");

  // Create ad
  const ad = await db.ad.create({
    data: {
      title: req.data.title,
      description: req.data.description,
      price: req.data.price,
      negotiable: req.data.negotiable,
      images: imageUrls,

      user: {
        connect: { id: user.id },
      },
      category: {
        connect: { path: req.data.categoryPath },
      },
    },
  });

  return NextResponse.json({ result: ad });
}
