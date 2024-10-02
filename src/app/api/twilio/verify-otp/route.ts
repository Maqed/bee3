import { checkPhoneNumberOTP } from "@/schema/twilio";
import { NextResponse } from "next/server";
import twilio from "twilio";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import { getUserById } from "@/database/users";
import { db } from "@/server/db";

export async function POST(request: Request) {
    const session = await getServerAuthSession();
    if (!session) return NextResponse.json({ error: "must-be-logged-in" });
    const {user} = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "must-be-logged-in" });

    const req = checkPhoneNumberOTP.safeParse(await request.json());
    if (!req.success) return NextResponse.json({ error: req.error });

    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    const { phoneNumber, code } = req.data;

    const verification = await client.verify.v2.services(env.TWILIO_SERVICE_SID).verificationChecks.create({
        code: code,
        to: "+20" + phoneNumber,
    });

    if (verification.status != "approved")
        return NextResponse.json({ error: "failed-verify-phone" }, { status: 500 });

    await db.user.update({
        where: { id: user.id },
        data: {
            phoneNumber: "+20" + phoneNumber
        }
    })

    return NextResponse.json({ result: verification.status });
}