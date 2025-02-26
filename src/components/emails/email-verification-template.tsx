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

interface EmailVerificationTemplateProps {
  name: string;
  verificationUrl: string;
  locale?: string;
}

// Translations
const translations = {
  en: {
    preview: "Verify your email address for Bee3",
    greeting: "Hi",
    message1:
      "Welcome to Bee3! Please verify your email address to get started.",
    buttonText: "Verify Email Address",
    ignore:
      "If you didn't create an account with Bee3, you can safely ignore this email.",
    footer: "© 2025 Bee3. All rights reserved.",
  },
  ar: {
    preview: "تحقق من عنوان بريدك الإلكتروني لـ Bee3",
    greeting: "مرحبًا",
    message1: "مرحبًا بك في Bee3! يرجى التحقق من عنوان بريدك الإلكتروني للبدء.",
    buttonText: "تحقق من عنوان البريد الإلكتروني",
    ignore:
      "إذا لم تقم بإنشاء حساب في Bee3، يمكنك تجاهل هذا البريد الإلكتروني بأمان.",
    footer: "© 2025 Bee3. جميع الحقوق محفوظة.",
  },
};

export default function EmailVerificationTemplate({
  name,
  verificationUrl,
  locale = "ar",
}: EmailVerificationTemplateProps) {
  // Select the correct translations
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
            <Section className="my-8 text-center">
              <EmailButton href={verificationUrl}>{t.buttonText}</EmailButton>
            </Section>
            <Text>{t.ignore}</Text>
          </Section>
          <Hr style={{ borderTop: "1px solid #eaeaea", margin: "26px 0" }} />
          <Section>
            <Text className="text-sm text-muted">{t.footer}</Text>
          </Section>
        </Container>
      </Body>
    </EmailBoilerplate>
  );
}
