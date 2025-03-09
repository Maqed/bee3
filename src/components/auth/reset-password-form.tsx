"use client";
import { useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useToast } from "../ui/use-toast";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPasswordSchema } from "@/schema/auth";
import { useTranslations } from "next-intl";
import Spinner from "../ui/spinner";
import PasswordCheckList from "../ui/password-checklist";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordForm() {
  const { toast } = useToast();
  const tInputs = useTranslations("auth.two-password-input");
  const tForm = useTranslations("auth./reset-password");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      toast({
        title: tForm("token-missing"),
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      await authClient.resetPassword({
        newPassword: values.password,
        token,
        fetchOptions: {
          onSuccess: () => {
            toast({
              title: tForm("success"),
              variant: "success",
            });
          },
          onError: () => {
            toast({ title: tForm("error"), variant: "destructive" });
          },
        },
      });
    });
  }
  return (
    <div className="flex h-full min-h-[50vh] w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{tForm("title")}</CardTitle>
          <CardDescription>{tForm("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tInputs("password.label")}</FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={isPending}
                          autoComplete="current-password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <PasswordCheckList
                        password={form.getValues("password")}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tInputs("confirmPassword.label")}</FormLabel>
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
                  {tInputs("submit")}{" "}
                  {isPending && <Spinner className="ms-1" />}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
