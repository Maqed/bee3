import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json({
      error: "you-must-provide-a-parameter",
      status: 400,
    });
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        bio: true,
        contactMethod: true,
        ads: {
          include: {
            images: {
              select: { url: true },
              take: 1,
            },
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "user-not-found", status: 404 });
  }
}
