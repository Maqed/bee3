"use client";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/schema/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/consts/routes";
// ui
import { Mail, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslations } from "next-intl";
import { absoluteURL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import { signIn } from "next-auth/react";

function EmailLoginForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth.card-wrapper.login.email");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch(absoluteURL("/api/auth/login"), {
          method: "POST",
          body: JSON.stringify(values),
        });
        const { email, password } = values;

        const data = await response.json();
        if (data.error) {
          toast({
            title: t(`errors.${data.error}.title`),
            description: t(`errors.${data.error}.description`),
            variant: "destructive",
          });
        } else {
          await signIn("credentials", {
            redirect: true,
            callbackUrl: DEFAULT_LOGIN_REDIRECT,
            email,
            password,
          });
        }
      } catch (error) {
        toast({
          title: "Failed to submit the form.",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Mail className="me-1 inline size-5" />
                {t("email.label")}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  autoComplete="email"
                  type="email"
                  placeholder={t("email.placeholder")}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Lock className="me-1 inline size-5" />
                {t("password.label")}
              </FormLabel>
              <FormControl>
                <PasswordInput
                  disabled={isPending}
                  autoComplete="current-password"
                  placeholder="********"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} className="w-full" type="submit">
          {t("submit")} {isPending && <Spinner className="ms-1" />}
        </Button>
      </form>
    </Form>
  );
}

export default EmailLoginForm;
