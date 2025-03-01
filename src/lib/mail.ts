import { Resend } from "resend";
import { env } from "@/env";
import { render } from "@react-email/components";
import EmailVerificationTemplate from "@/components/emails/email-verification-template";
import ResetPasswordTemplate from "@/components/emails/reset-password-template";

const resend = new Resend(env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
      from: `Bee3 <${env.RESEND_FROM_EMAIL || "noreply@yourdomain.com"}>`,
      to: email,
      subject: subjects[locale as keyof typeof subjects] || subjects.en,
      html: emailHtml,
    });

    if (error) {
      throw error;
    }

    return { success: true, messageId: data?.id };
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
    const { data, error } = await resend.emails.send({
      from: `Bee3 <${env.RESEND_FROM_EMAIL || "noreply@yourdomain.com"}>`,
      to: email,
      subject: subjects[locale as keyof typeof subjects] || subjects.en,
      html: emailHtml,
    });

    if (error) {
      throw error;
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
