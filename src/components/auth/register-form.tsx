import CardWrapper from "@/components/auth/card-wrapper";
import { useTranslations } from "next-intl";

function RegisterForm() {
  const t = useTranslations("/register");
  return (
    <CardWrapper
      headerLabel={t("headerLabel")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/login"
      showSocial
    ></CardWrapper>
  );
}

export default RegisterForm;
