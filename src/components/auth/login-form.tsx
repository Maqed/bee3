import CardWrapper from "@/components/auth/card-wrapper";
import { useTranslations } from "next-intl";

function LoginForm() {
  const t = useTranslations("/login");
  return (
    <CardWrapper
      headerLabel={t("headerLabel")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/register"
      showSocial
    ></CardWrapper>
  );
}

export default LoginForm;
