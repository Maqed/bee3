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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") as AD_STATUS | "ALL" | null;

    // Build where clause for filtering
    const where: any = {
      userId: session.user.id,
      deletedAt: null, // Only show non-deleted ads
    };

    // Apply status filter if provided
    if (
      statusFilter &&
      statusFilter !== "ALL" &&
      Object.values(AD_STATUS).includes(statusFilter as AD_STATUS)
    ) {
      where.adStatus = statusFilter;
    }

    // Fetch user's ads with relevant information
    const ads = await db.ad.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        negotiable: true,
        adStatus: true,
        createdAt: true,
        categoryPath: true,
        cityId: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error fetching user's ads:", error);
    return NextResponse.json(
      { error: "internal-server-error" },
      { status: 500 },
    );
  }
}
