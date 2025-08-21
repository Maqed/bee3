import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/server/db";
import { AD_STATUS } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: "must-be-logged-in" }, { status: 401 });
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "unauthorized-admin-only" },
        { status: 403 },
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const adStatus = searchParams.get("adStatus") as AD_STATUS | null;

    // Build where clause for filtering
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (adStatus && Object.values(AD_STATUS).includes(adStatus)) {
      where.adStatus = adStatus;
    }

    // Fetch ads with relevant information
    const ads = await db.ad.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        negotiable: true,
        adStatus: true,
        rejectedFor: true,
        tier: true,
        createdAt: true,
        updatedAt: true,
        categoryPath: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            path: true,
          },
        },
        city: {
          select: {
            id: true,
            city_name_ar: true,
            city_name_en: true,
          },
        },
        governorate: {
          select: {
            id: true,
            governorate_name_ar: true,
            governorate_name_en: true,
          },
        },
        _count: {
          select: {
            favoritedBy: true,
          },
        },
        analytics: {
          select: {
            views: true,
            uniqueViews: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "internal-server-error" },
      { status: 500 },
    );
  }
}
