import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
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

    // Fetch all users with relevant information
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            ads: true,
            favoriteAds: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "internal-server-error" },
      { status: 500 },
    );
  }
}
