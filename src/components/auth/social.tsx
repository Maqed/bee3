"use client";
import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/consts/routes";
import { useTranslations } from "next-intl";

function Social() {
  const t = useTranslations("auth.card-wrapper.social");
  function handleClick(provider: "google" | "facebook") {
    return signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  }

  return (
    <>
      <Button
        size="lg"
        className="flex w-full gap-x-2"
        variant="outline"
        onClick={() => handleClick("google")}
      >
        {t("Google")}
        <Image
          src="/OAuthProviders/Google.webp"
          alt={"Google"}
          width={100}
          height={100}
          className="size-5"
        />
      </Button>
      <Button
        size="lg"
        className="flex w-full gap-x-2"
        variant="outline"
        onClick={() => handleClick("facebook")}
      >
        {t("Facebook")}
        <Image
          src="/OAuthProviders/Facebook.svg"
          alt={"Facebook"}
          width={100}
          height={100}
          className="size-5"
        />
      </Button>
    </>
  );
}

export default Social;
