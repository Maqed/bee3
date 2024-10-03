"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import Social from "@/components/auth/social";
import BackButton from "@/components/auth/back-button";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import SeparatorWithText from "../ui/separator-with-text";
import { ReactNode, useState } from "react";
import { BackwardArrow } from "../ui/arrows";

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

type Methods = "" | "email";

function CardWrapper({
  headerLabel,
  children,
  continueWithEmailForm,
  backButtonHref,
  backButtonLabel,
  isAuthenticationWrapper = false,
}: CardWrapperProps) {
  const t = useTranslations("auth.card-wrapper");
  const [selectedMethod, setSelectedMethod] = useState<Methods>("");
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <h1 className="text-3xl font-semibold">Bee3Online</h1>
          <p className="text-sm text-muted-foreground">{headerLabel}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        {selectedMethod === "email" && continueWithEmailForm}
        {selectedMethod && (
          <Button
            className="mt-5"
            onClick={() => {
              setSelectedMethod("");
            }}
            variant="link"
          >
            <BackwardArrow /> {t("go-back")}
          </Button>
        )}
        {children}
      </CardContent>
      <CardFooter className="flex w-full flex-col items-center gap-y-2">
        {!selectedMethod && isAuthenticationWrapper && (
          <>
            <Button
              onClick={() => {
                setSelectedMethod("email");
              }}
              size="lg"
              className="flex w-full gap-x-2"
              variant="outline"
            >
              {t("email.title")} <Mail className="size-5 text-primary" />
            </Button>
            <SeparatorWithText>{t("or")}</SeparatorWithText>
            <Social />
          </>
        )}
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
}

export default CardWrapper;
