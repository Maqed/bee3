import { getServerAuthSession } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { userSettingsSchema } from "@/schema/user-settings";
import { getUserByEmail, getUserById } from "@/database/users";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const email = request.nextUrl.searchParams.get("email");
  if (!id && !email)
    return NextResponse.json({
      error: "you-must-provide-a-parameter",
      status: 400,
    });
  if (id && email) {
    return NextResponse.json({
      error: "you-must-provide-only-one-parameter",
      status: 400,
    });
  }

  try {
    let user = null;
    if (id) {
      user = await getUserById(id);
    }
    if (email) {
      user = await getUserByEmail(email);
    }
    if (!user) {
      return NextResponse.json({ error: "user-not-found", status: 404 });
    }

    return NextResponse.json({
      user: {
        ...user,
        email: undefined,
        password: undefined,
        phoneNumber: undefined,
        image: undefined,
      },
    });
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
