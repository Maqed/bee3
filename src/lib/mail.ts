import nodemailer from "nodemailer";
import { env } from "@/env";
import { render } from "@react-email/components";
import EmailVerificationTemplate from "@/components/emails/email-verification-template";
import ResetPasswordTemplate from "@/components/emails/reset-password-template";

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

export async function sendResetPasswordEmail({
  email,
  name,
  resetUrl,
  locale = "en",
}: {
  email: string;
  name: string;
  resetUrl: string;
  locale?: string;
}) {
  const emailHtml = await render(
    ResetPasswordTemplate({
      name,
      resetUrl,
      locale,
    }),
  );

  const subjects = {
    en: "Reset your password for Bee3",
    ar: "إعادة تعيين كلمة المرور الخاصة بك لـ Bee3",
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
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
