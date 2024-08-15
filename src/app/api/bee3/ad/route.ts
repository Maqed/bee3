import { NextResponse } from 'next/server';
import { getServerAuthSession } from '@/server/auth';
import { getUserById } from '@/actions/users';
import { adSchema } from '@/zod/ad';
import { db } from "@/server/db";
import { AdTiers } from '@prisma/client';

export async function GET(request: Request) {
  const req = await request.json();
  const ad = db.ad.findUniqueOrThrow({ where: { id: req.id } });

  return NextResponse.json({ ad });
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "must-be-logged-in" });

  const req = adSchema.safeParse(await request.json());
  if (!req.success)
    return NextResponse.json({ error: req.error });

  let sellerDataId = user.sellerData?.id;

  if (sellerDataId === null) {
    const sellerData = await db.sellerData.create({
      data: {
        user: {
          connect: { id: user.id }
        },
        tokensStorage: {
          createMany: {
            data: [
              {
                tokenType: AdTiers.Free,
                count: 20
              },
              {
                tokenType: AdTiers.Pro,
                count: 3
              },
              {
                tokenType: AdTiers.Expert,
                count: 1
              }
            ]
          }
        }
      }
    });
    sellerDataId = sellerData.id;
  }

  // db.adTokenStore.update({
  //   where: {
  //     sellerDataId: sellerDataId,
  //     tokenType: req.data.tier
  //   }
  // });

  const ad = await db.ad.create({
    data: {
      tier: req.data.tier,
      title: req.data.title,
      description: req.data.description,
      price: req.data.price,
      category: req.data.category,
      negotiable: req.data.negotiable,
      tags: req.data.tags,

      sellerData: {
        connect: { userId: user.id }
      }
    }
  });


  return NextResponse.json({ result: ad });
}