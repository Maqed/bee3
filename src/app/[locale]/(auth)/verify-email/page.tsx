"use client";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/use-toast";
import CardWrapper from "@/components/auth/card-wrapper";
import Spinner from "@/components/ui/spinner";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { absoluteURL } from "@/lib/utils";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";

function VerifyEmailPage() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tVerifyEmail = useTranslations("auth.card-wrapper.verify-email");
  const tErrors = useTranslations("errors.verify-email");

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError(tErrors("missing-token"));
      return;
    }
    const response = await fetch(absoluteURL("/api/auth/verify-email"), {
      method: "POST",
      body: JSON.stringify(token),
    });
    const data = await response.json();
    if (data.error) {
      setError(tErrors(data.error));
    } else {
      setSuccess(tVerifyEmail("success.title"));
      toast({
        title: tVerifyEmail("success.title"),
        description: tVerifyEmail("success.description"),
        variant: "success",
      });
      router.push(DEFAULT_UNAUTHENTICATED_REDIRECT);
    }
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      isAuthenticationWrapper={false}
      headerLabel={tVerifyEmail("headerLabel")}
      backButtonLabel={tVerifyEmail("backButtonLabel")}
      backButtonHref={DEFAULT_UNAUTHENTICATED_REDIRECT}
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <Spinner />}
        <Alert variant="success" message={success} />
        {!success && <Alert variant="destructive" message={error} />}
      </div>
    </CardWrapper>
  );
}

export default VerifyEmailPage;
