"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/consts/routes";
import { useSearchParams } from "next/navigation";

function Social() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  function handleClick(provider: "google") {
    // signIn(provider, {
    //   callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    // });
  }

  return (
    <div className="flex w-full items-center gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => {
          handleClick("google");
        }}
      >
        Continue With Google{" "}
        <Image
          src="/OAuthProviders/Google.webp"
          alt={"Google"}
          width={100}
          height={100}
          className="ml-2 h-5 w-5"
        />
      </Button>
    </div>
  );
}

export default Social;
