import { useTranslations } from "next-intl";
import { useTransition } from "react";
import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPhoneNumberOTP } from "@/schema/twilio";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/ui/phone-input";
import {
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import type { dialogStates } from "./user-phone-button";
import type { InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import type React from "react"; // Added import for React

type Props = {
  setSharedPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setDialogState: React.Dispatch<React.SetStateAction<dialogStates>>;
} & InputProps;

function InputNumber({
  className,
  setSharedPhoneNumber,
  setDialogState,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const tPhoneNumber = useTranslations("phoneNumber.InputNumber");
  const tDialog = useTranslations("dialog");

  const form = useForm<z.infer<typeof sendPhoneNumberOTP>>({
    resolver: zodResolver(sendPhoneNumberOTP),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof sendPhoneNumberOTP>) => {
    startTransition(async () => {
      const { phoneNumber } = values;
      await authClient.phoneNumber.sendOtp({
        phoneNumber: "+20" + phoneNumber,
        fetchOptions: {
          onError: (ctx) => {
            form.setError("phoneNumber", {
              message: `phone-number.input-phone-number.${ctx.error.code}`,
            });
          },
          onSuccess: (ctx) => {
            setSharedPhoneNumber(values.phoneNumber);
            setDialogState("OTP");
          },
        },
      });
    });
  };

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
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PhoneInput
                  autoFocus
                  value={field.value}
                  disabled={isPending}
                  onValueChange={({ value }) => {
                    field.onChange(value);
                  }}
                  placeholder={tPhoneNumber("placeholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter className="flex justify-between sm:space-x-0">
          <AlertDialogCancel disabled={isPending} className="text-sm">
            {tDialog("close")}
          </AlertDialogCancel>
          <Button
            variant="link"
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {tPhoneNumber("sendCode")}
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

export default InputNumber;
