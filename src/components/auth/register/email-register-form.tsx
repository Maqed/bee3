"use client";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerSchema } from "@/schema/auth";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
// ui
import { Mail, User, Lock } from "lucide-react";
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
import PasswordCheckList from "@/components/ui/password-checklist";

function EmailRegisterForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth.card-wrapper.register.email");
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch(absoluteURL("/api/auth/register"), {
          method: "POST",
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.error) {
          toast({
            title: t(`errors.${data.error}.title`),
            description: t(`errors.${data.error}.description`),
            variant: "destructive",
          });
        } else {
          toast({
            title: t("user-created-successfully.title"),
            description: t("user-created-successfully.description"),
            variant: "success",
          });
          router.push(DEFAULT_UNAUTHENTICATED_REDIRECT);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <User className="me-1 inline size-5" />
                {t("name.label")}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  autoComplete="username"
                  placeholder={t("name.placeholder")}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
              <PasswordCheckList password={form.getValues("password")} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Lock className="me-1 inline size-5" />
                {t("confirmPassword.label")}
              </FormLabel>
              <FormControl>
                <PasswordInput
                  disabled={isPending}
                  autoComplete="new-password"
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

export default EmailRegisterForm;
