import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/server/auth";

export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session) return NextResponse.json({ error: "must-be-logged-in" });

    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        favoriteAds: true,
      },
    });
    if (!user) return NextResponse.json({ error: "must-be-logged-in" });
    const { favoriteAds } = user;

    return NextResponse.json({ favoriteAds });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
