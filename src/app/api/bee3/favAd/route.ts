import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { getUserById } from "@/database/users";
import { db } from "@/server/db";
import { favAdSchema } from "@/schema/ad";
import { getAcceptedAdFromNonBannedUserById } from "@/database/ad";

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ error: "must-be-logged-in" });

  const req = favAdSchema.safeParse(await request.json());
  if (!req.success)
    return NextResponse.json({ error: req.error }, { status: 500 });

  const ad = await getAcceptedAdFromNonBannedUserById(req.data!.adId);
  if (!ad) return NextResponse.json({ error: "ad-not-found" }, { status: 404 });

  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        favoriteAds: req.data.state
          ? { connect: { id: ad.id } } // Add to favorites
          : { disconnect: { id: ad.id } }, // Remove from favorites
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
