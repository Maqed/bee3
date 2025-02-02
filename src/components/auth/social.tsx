"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_UNAUTHENTICATED_REDIRECT,
} from "@/consts/routes";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";

function Social() {
  const t = useTranslations("auth.card-wrapper.social");
  function handleClick(provider: "google" | "facebook") {
    return authClient.signIn.social({
      provider,
      callbackURL: DEFAULT_LOGIN_REDIRECT,
      errorCallbackURL: DEFAULT_UNAUTHENTICATED_REDIRECT,
    });
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
