import { getServerAuthSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { userSettingsSchema } from "@/schema/user-settings";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "you-must-provide-an-id", status: 400 });
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        name: true,
        bio: true,
        createdAt: true,
        ads: true,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "user-not-found", status: 404 });
  }
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  const req = userSettingsSchema.safeParse(await request.json());
  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      ...req.data,
    },
  });
  return NextResponse.json({ message: "updated" });
}

export async function DELETE() {
  const session = await getServerAuthSession();
  if (!session) return NextResponse.json({ error: "must-be-logged-in" });
  try {
    await db.user.delete({ where: { id: session.user.id } });
  } catch (error) {
    console.log(error);
  }
  return NextResponse.json({ message: "deleted" });
}
