import nodemailer from "nodemailer";
import { env } from "@/env";
import { render } from "@react-email/components";
import EmailVerificationTemplate from "@/components/emails/email-verification-template";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.SMTP_AUTH_USER,
    pass: env.SMTP_AUTH_PASSWORD,
  },
});

export async function sendVerificationEmail({
  email,
  name,
  verificationUrl,
  locale = "en",
}: {
  email: string;
  name: string;
  verificationUrl: string;
  locale?: string;
}) {
  const emailHtml = await render(
    EmailVerificationTemplate({
      name,
      verificationUrl,
      locale,
    }),
  );
  const subjects = {
    en: "Verify your email address for Bee3",
    ar: "تحقق من عنوان بريدك الإلكتروني لـ Bee3",
  };
  try {
    const info = await transporter.sendMail({
      from: `"Bee3" <${env.SMTP_AUTH_USER}>`,
      to: email,
      subject: subjects[locale as keyof typeof subjects] || subjects.en,
      html: emailHtml,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}
