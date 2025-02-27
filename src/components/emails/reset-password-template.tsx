import React from "react";
import {
  Body,
  Container,
  Heading,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import EmailButton from "./email-button";
import EmailBoilerplate from "./email-template-boilerplate";

interface PasswordResetTemplateProps {
  name: string;
  resetUrl: string;
  locale?: string;
}

const translations = {
  en: {
    preview: "Reset your password for Bee3",
    greeting: "Hi",
    message1:
      "We received a request to reset your password for your Bee3 account.",
    message2: "Please click the button below to reset your password.",
    buttonText: "Reset Password",
    ignore:
      "If you didn't request a password reset, you can safely ignore this email.",
    securityNote:
      "For security purposes, this password reset link will expire after a short period of time",
    footer: "© 2025 Bee3. All rights reserved.",
  },
  ar: {
    preview: "إعادة تعيين كلمة المرور الخاصة بك لـ Bee3",
    greeting: "مرحبًا",
    message1: "لقد تلقينا طلبًا لإعادة تعيين كلمة المرور لحسابك في Bee3.",
    message2: "يرجى النقر على الزر أدناه لإعادة تعيين كلمة المرور الخاصة بك.",
    buttonText: "إعادة تعيين كلمة المرور",
    ignore:
      "إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني بأمان.",
    securityNote:
      "لأغراض أمنية، ستنتهي صلاحية رابط إعادة تعيين كلمة المرور بعد وقت قصير.",
    footer: "© 2025 Bee3. جميع الحقوق محفوظة.",
  },
};

export default function ResetPasswordTemplate({
  name,
  resetUrl,
  locale = "ar",
}: PasswordResetTemplateProps) {
  const t =
    translations[locale as keyof typeof translations] || translations.en;

  return (
    <EmailBoilerplate locale={locale}>
      <Preview>{t.preview}</Preview>
      <Body>
        <Container>
          <Section className="py-5">
            <Heading
              as="h1"
              className="text-center text-2xl font-bold text-primary"
            >
              Bee3
            </Heading>
          </Section>
          <Hr style={{ borderTop: "1px solid #eaeaea" }} />
          <Section className="py-5">
            <Text>
              {t.greeting} {name},
            </Text>
            <Text>{t.message1}</Text>
            <Text>{t.message2}</Text>
            <Section className="my-8 text-center">
              <EmailButton href={resetUrl}>{t.buttonText}</EmailButton>
            </Section>
            <Text>{t.ignore}</Text>
            <Text
              className="text-sm"
              style={{ color: "#666666", marginTop: "16px" }}
            >
              {t.securityNote}
            </Text>
          </Section>
          <Hr style={{ borderTop: "1px solid #eaeaea", margin: "26px 0" }} />
          <Section>
            <Text className="text-sm">{t.footer}</Text>
          </Section>
        </Container>
      </Body>
    </EmailBoilerplate>
  );
}
