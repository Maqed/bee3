import { registerSchema } from "@/schema/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/server/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  const req = registerSchema.safeParse(await request.json());
  if (req.error)
    return NextResponse.json({ error: "invalid-input", status: 400 });
  const { name, email, password } = req.data;
  const isExistingUser = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (isExistingUser)
    return NextResponse.json({ error: "email-exists", status: 400 });
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: `Error occured during creating user ${error}`,
      status: 500,
    });
  }

  const verificationToken = await generateVerificationToken(email);
  try {
    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
      name,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Error has occured sending verification email ${error}`,
      status: 500,
    });
  }
  return NextResponse.json({ message: "user-created-successfully" });
}
