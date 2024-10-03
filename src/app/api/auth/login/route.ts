import { getUserByEmail } from "@/database/users";
import { loginSchema } from "@/schema/auth";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = loginSchema.safeParse(await request.json());
  if (req.error) {
    return NextResponse.json({ error: "invalid-input", status: 400 });
  }

  const { email, password } = req.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.password)
    return NextResponse.json({ error: "invalid-credentials", status: 400 });
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch)
    return NextResponse.json({ error: "invalid-credentials", status: 400 });
  return NextResponse.json({ user: { ...existingUser, password: undefined } });
}
