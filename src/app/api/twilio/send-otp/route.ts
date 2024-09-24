import { sendPhoneNumberOTP } from "@/schema/twilio";
import { NextResponse } from "next/server";
import twilio from "twilio";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import { getUserById } from "@/actions/users";

export async function POST(request: Request) {
    const session = await getServerAuthSession();
    if (!session) return NextResponse.json({ error: "must-be-logged-in" });
    const user = await getUserById(session.user.id);
    if (!user) return NextResponse.json({ error: "must-be-logged-in" });

    const req = sendPhoneNumberOTP.safeParse(await request.json());
    if (!req.success) return NextResponse.json({ error: req.error });

    const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    const { phoneNumber } = req.data;

    try {
        const verification = await client.verify.v2.services(env.TWILIO_SERVICE_SID).verifications.create({
            channel: "sms",
            to: "+20" + phoneNumber,
            rateLimits: {
                endUserId: user.id,
            }
        });

        return NextResponse.json({ result: verification.status });
    } catch (error) {
        return NextResponse.json({ error: "failed-too-many-requests" }, { status: 500 });
    }
}