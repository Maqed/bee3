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
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import Spinner from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function EmailLoginForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const tLoginEmail = useTranslations("auth.card-wrapper.login.email");
  const router = useRouter();
  const tErrors = useTranslations("errors.login");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      const { email, password, rememberMe } = values;
      await authClient.signIn.email(
        {
          email,
          password,
          rememberMe,
        },
        {
          onSuccess: () => {
            router.push(DEFAULT_LOGIN_REDIRECT);
            router.refresh();
          },
          onError: (ctx) => {
            toast({
              title: tErrors(`${ctx.error.code}.title`),
              description: tErrors(`${ctx.error.code}.description`),
              variant: "destructive",
            });
          },
        },
      );
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
                {tLoginEmail("email.label")}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  autoFocus
                  autoComplete="email"
                  type="email"
                  placeholder={tLoginEmail("email.placeholder")}
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
                {tLoginEmail("password.label")}
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
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-1 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{tLoginEmail("rememberMe.label")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button disabled={isPending} className="w-full" type="submit">
          {tLoginEmail("submit")} {isPending && <Spinner className="ms-1" />}
        </Button>
      </form>
    </Form>
  );
}

export default EmailLoginForm;
