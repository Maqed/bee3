import { NextResponse } from "next/server";
import { getUserByEmail } from "@/database/users";
import { getVerificationTokenByToken } from "@/database/tokens";
import { db } from "@/server/db";

export async function POST(request: Request) {
  const token = await request.json();
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return NextResponse.json({ error: "token-doesn't-exist", status: 400 });
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return NextResponse.json({ error: "token-expired", status: 400 });
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return NextResponse.json({ error: "email-doesn't-exist", status: 400 });
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return NextResponse.json({ message: "verified!", status: 200 });
}
