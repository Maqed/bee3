import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(
  request: Request,
  context: { params: { adId: string } },
) {
  const { params } = context;

  try {
    let ad = await db.ad.findUniqueOrThrow({
      where: { id: params.adId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            contactMethod: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
        attributeValues: {
          include: {
            attribute: {
              select: {
                id: true,
                name: true,
                type: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ ad });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
