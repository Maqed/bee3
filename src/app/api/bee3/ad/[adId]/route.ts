import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { getServerAuthSession } from "@/lib/auth";

export async function DELETE(
  request: Request,
  context: { params: { adId: string } },
) {
  const { params } = context;
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });

  try {
    const where: any = { id: params.adId };
    if (session.user.role !== "admin") {
      where.userId = session.user.id;
    }

    const ad = await db.ad.update({
      where,
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: "Ad deleted successfully", ad });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
