import { EmailVerificationToken } from "@/components/emails/email-verification-token";
import { Resend } from "resend";
import { env } from "@/env";
import { absoluteURL } from "./utils";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  email,
  token,
  name,
}: {
  email: string;
  token: string;
  name: string;
}) => {
  const confirmLink = absoluteURL(`/verify-email?token=${token}`);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    react: EmailVerificationToken({ confirmLink, name }),
  });
};
