import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth';
import { getUserById } from '@/actions/users';
import { adSchema } from '@/zod/ad';
import { db } from "@/server/db";

export async function GET() {
  return NextResponse.json({ hello: "world" });
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "must-be-logged-in" });

  const isSeller = user.sellerProfile !== null;

  const req = adSchema.safeParse(await request.json());
  if (!req.success)
    return NextResponse.json({ error: req.error });

  const ad = await db.ad.create({
    data: {
      tier: req.data.tier,
      title: req.data.title,
      description: req.data.description,
      price: req.data.price,
      category: req.data.category,
      negotiable: req.data.negotiable,
      tags: req.data.tags,
      published: isSeller,

      seller: {
        connect: { userId: user.id }
      }
    }
  });

  if (!isSeller) {
    return NextResponse.json({ result: ad, message: "not-published-no-seller-profile" });
  }

  return NextResponse.json({ result: ad });
}