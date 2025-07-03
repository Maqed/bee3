"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Social from "@/components/auth/social";
import BackButton from "@/components/auth/back-button";
import { useTranslations } from "next-intl";
import SeparatorWithText from "../ui/separator-with-text";
import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type CardWrapperProps = {
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  isAuthenticationWrapper: boolean;
} & (
  | {
      isAuthenticationWrapper: true;
      children?: ReactNode;
      continueWithEmailForm: ReactNode;
    }
  | {
      isAuthenticationWrapper: false;
      children: ReactNode;
      continueWithEmailForm?: ReactNode;
    }
);

function CardWrapper({
  headerLabel,
  children,
  continueWithEmailForm,
  backButtonHref,
  backButtonLabel,
  isAuthenticationWrapper = false,
}: CardWrapperProps) {
  const t = useTranslations("auth.card-wrapper");
  const tSocialErrors = useTranslations("errors.social");
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return (
    <Card className="w-full max-w-2xl shadow-md">
      <CardHeader>
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <h1 className="text-3xl font-semibold">Bee3</h1>
          <p className="text-sm text-muted-foreground">{headerLabel}</p>
        </div>
        {error && (
          <Alert
            variant="destructive"
            message={tSocialErrors(`${searchParams.get("error")}.title`)}
            description={tSocialErrors(
              `${searchParams.get("error")}.description`,
            )}
          />
        )}
      </CardHeader>
      <CardContent
        className={cn("pb-0", {
          "flex flex-col gap-3": isAuthenticationWrapper,
        })}
      >
        {children}
        {isAuthenticationWrapper && (
          <>
            <Social />
            <SeparatorWithText>{t("or")}</SeparatorWithText>
            {continueWithEmailForm}
          </>
        )}
      </CardContent>
      <BackButton label={backButtonLabel} href={backButtonHref} />
    </Card>
  );
}

export default CardWrapper;
