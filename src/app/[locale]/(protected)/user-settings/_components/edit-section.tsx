"use client";
import type { z } from "zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { userSettingsSchema } from "@/schema/user-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TransitionStartFunction } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { absoluteURL } from "@/lib/utils";

type Props = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

function EditAccountSection({ isPending, startTransition }: Props) {
  const { data: session, update, status } = useSession();
  const { toast } = useToast();
  const t = useTranslations("/user-settings");
  const form = useForm<z.infer<typeof userSettingsSchema>>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: session?.user.name ?? "",
      bio: session?.user.bio ?? "",
    },
    values: session?.user,
  });
  async function onSubmit(values: z.infer<typeof userSettingsSchema>) {
    startTransition(async () => {
      const response = await fetch(absoluteURL("/api/user"), {
        method: "POST",
        body: JSON.stringify(values),
      });
      const responseJson = await response.json();
      if (!responseJson.error) {
        await update({
          ...session,
          user: {
            ...session?.user,
            ...values,
          },
        });
      }
      toast({
        variant: responseJson.message ? "success" : "destructive",
        title: t(`toast.${responseJson.message ?? responseJson.error}`),
      });
    });
  }
  return (
    <section className="mb-3">
      <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
      <hr className="my-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.name.title")}</FormLabel>
                <FormControl>
                  {status === "loading" ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Input
                      disabled={isPending}
                      placeholder={t("settings.name.placeholder")}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  {t("settings.name.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.bio.title")}</FormLabel>
                <FormControl>
                  {status === "loading" ? (
                    <Skeleton className="h-16 w-full" />
                  ) : (
                    <Textarea
                      disabled={isPending}
                      placeholder={t("settings.bio.placeholder")}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  {t("settings.bio.description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} type="submit">
            {t("settings.button-submit")}
          </Button>
        </form>
      </Form>
    </section>
  );
}

export default EditAccountSection;
