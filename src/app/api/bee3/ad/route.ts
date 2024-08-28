import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/server/auth";
import { getUserById } from "@/actions/users";
import { adSchema } from "@/schema/ad";
import { db } from "@/server/db";

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "must-be-logged-in" });
  const req = adSchema.safeParse(await request.json());
  if (!req.success) return NextResponse.json({ error: req.error });

  const tokenStore = await db.adTokenStore.findUnique({
    where: {
      userId_tokenType: {
        userId: user.id,
        tokenType: "Free",
      },
    },
  });

  if (tokenStore?.count === 0)
    return NextResponse.json({ error: "failed-not-enough-tokens" });

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
  const ad = await db.ad.create({
    data: {
      title: req.data.title,
      description: req.data.description,
      price: req.data.price,
      negotiable: req.data.negotiable,
      images: req.data.images,

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
