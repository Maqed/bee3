import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/lib/auth";
import { getNonDeletedAdById } from "@/database/ad";

export async function GET(
  request: Request,
  context: { params: { adId: string } },
) {
  const { params } = context;

  try {
    let ad = await getNonDeletedAdById(params.adId, {
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

export async function DELETE(
  request: Request,
  context: { params: { adId: string } },
) {
  const { params } = context;
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });

  try {
    // When adding admin plugin, Make sure that the admin and the user can delete the ad.
    const ad = await db.ad.update({
      where: { id: params.adId, userId: session.user.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: "Ad deleted successfully", ad });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
