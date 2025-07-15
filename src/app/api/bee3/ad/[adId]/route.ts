import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: { adId: string } },
) {
  const { params } = context;

  try {
    let ad = await db.ad.findUnique({
      where: { id: params.adId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            contactMethod: true,
            banned: true,
            role: true,
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

    if (!ad || ad.deletedAt !== null || ad.user?.banned) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    if (ad.adStatus === "ACCEPTED") {
      return NextResponse.json({ ad });
    }
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = session.user.id === ad.userId;

    if (ad.adStatus === "REJECTED" || ad.adStatus === "PENDING") {
      if (!isAdmin && !isOwner) {
        return NextResponse.json({ error: "Ad not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ ad });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
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
