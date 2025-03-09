"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_UNAUTHENTICATED_REDIRECT,
} from "@/consts/routes";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
const providers: ["google", "facebook"] = ["google", "facebook"];
type Provider = (typeof providers)[number];

function Social() {
  const t = useTranslations("auth.card-wrapper.social");
  function handleClick(provider: Provider) {
    return authClient.signIn.social({
      provider,
      callbackURL: DEFAULT_LOGIN_REDIRECT,
      errorCallbackURL: DEFAULT_UNAUTHENTICATED_REDIRECT,
    });
  }

  return (
    <>
      {providers.map((provider) => (
        <Button
          size="lg"
          className="flex w-full gap-x-2"
          variant="outline"
          onClick={() => handleClick(provider)}
        >
          {t(provider)}
          <Image
            src={`/OAuthProviders/${provider}.webp`}
            alt={`Continue with ${provider}`}
            width={100}
            height={100}
            className="size-5"
          />
        </Button>
      ))}
    </>
  );
}

export default Social;
