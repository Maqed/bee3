"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/schema/auth";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import Spinner from "../ui/spinner";

export default function ForgetPasswordForm() {
  const t = useTranslations("auth./forgot-password");
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const { toast } = useToast();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    startTransition(async () => {
      await authClient.forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
        fetchOptions: {
          onSuccess: () => {
            toast({
              title: t("toast.success"),
              variant: "success",
            });
          },
          onError: () => {
            toast({
              title: t("toast.error"),
              variant: "destructive",
            });
          },
        },
      });
    });
  }

  return (
    <div
      className="flex h-full min-h-[40vh] w-full items-center justify-center px-4"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel htmlFor="email">{t("emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Spinner className="size-5" /> : t("submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
