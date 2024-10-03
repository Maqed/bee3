"use client";
import CardWrapper from "@/components/auth/card-wrapper";
import EmailRegisterForm from "./email-register-form";
import { useTranslations } from "next-intl";

function RegisterForm() {
  const t = useTranslations("auth.card-wrapper.register");

  return (
    <CardWrapper
      headerLabel={t("headerLabel")}
      isAuthenticationWrapper={true}
      continueWithEmailForm={<EmailRegisterForm />}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/login"
    />
  );
}

export default RegisterForm;
