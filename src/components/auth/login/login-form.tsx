import CardWrapper from "@/components/auth/card-wrapper";
import { useTranslations } from "next-intl";
import EmailLoginForm from "./email-login-form";

function LoginForm() {
  const t = useTranslations("auth.card-wrapper.login");
  return (
    <CardWrapper
      isAuthenticationWrapper={true}
      continueWithEmailForm={<EmailLoginForm />}
      headerLabel={t("headerLabel")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/register"
    />
  );
}

export default LoginForm;
