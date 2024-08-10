"use client";
import type { z } from "zod";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { userSettingsSchemaIntl } from "@/schemas/user-settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { TransitionStartFunction } from "react";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { updateUserAction } from "@/actions/users";

type Props = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

function EditAccountSection({ isPending, startTransition }: Props) {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const t = useTranslations("/user-settings");
  const formSchema = userSettingsSchemaIntl(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: session?.user.name,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const response = await updateUserAction(values);
      await update();
      toast({
        variant: response.message ? "success" : "destructive",
        title: t(response.message ?? response.error),
      });
    });
  }
  return (
    <section className="mb-3">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <hr className="my-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder={t("name-placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("name-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit">
            {t("button-submit")}
          </Button>
        </form>
      </Form>
    </section>
  );
}

export default EditAccountSection;
