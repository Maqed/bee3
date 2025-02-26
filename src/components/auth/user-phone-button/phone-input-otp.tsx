import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { checkPhoneNumberOTP } from "@/schema/phone-verification";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormItem,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { dialogStates } from "./user-phone-button";
import type { InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import type React from "react"; // Import React

const MAX_LENGTH = 6;

type Props = {
  phoneNumber: string;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogState: React.Dispatch<React.SetStateAction<dialogStates>>;
} & InputProps;

function PhoneInputOTP({
  className,
  phoneNumber,
  setDialogState,
  setIsDialogOpen,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const tPhoneNumber = useTranslations("phoneNumber");
  const tPhoneNumberOTP = useTranslations("phoneNumber.OTP");
  const locale = useLocale();

  const form = useForm<z.infer<typeof checkPhoneNumberOTP>>({
    resolver: zodResolver(checkPhoneNumberOTP),
    defaultValues: {
      code: "",
      phoneNumber,
    },
  });

  function onSubmit(values: z.infer<typeof checkPhoneNumberOTP>) {
    startTransition(async () => {
      const { code, phoneNumber } = values;
      await authClient.phoneNumber.verify({
        phoneNumber: "+20" + phoneNumber,
        code,
        disableSession: true,
        updatePhoneNumber: true,
        fetchOptions: {
          onError: (ctx) => {
            form.setError("code", {
              message: `phone-number.OTP.${ctx.error.code}`,
            });
          },
          onSuccess: () => {
            setIsDialogOpen(false);
            setDialogState("InputNumber");
          },
        },
      });
    });
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className={cn("flex flex-col gap-3", className)}
      >
        <FormField
          control={form.control}
          disabled={isPending}
          name="code"
          render={({ field }) => (
            <FormItem>
              <div
                className={cn({
                  "flex justify-end": locale === "ar",
                })}
                dir="ltr"
              >
                <FormControl>
                  <InputOTP autoFocus maxLength={MAX_LENGTH} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </div>
              <FormDescription>
                {tPhoneNumberOTP("otp-description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <AlertDialogFooter className="flex justify-between sm:space-x-0">
          <Button
            variant="ghost"
            type="reset"
            onClick={() => {
              setDialogState("InputNumber");
            }}
          >
            {tPhoneNumber("go-back")}
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {tPhoneNumberOTP("verifyCode")}
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

export default PhoneInputOTP;
