"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PhoneInput, { PhoneInputProps } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import InputNumber from "./input-number";
import PhoneInputOTP from "./phone-input-otp";

export type dialogStates = "InputNumber" | "OTP" | "error";

function UserPhoneButton({ className, value, ...props }: PhoneInputProps) {
  const [dialogState, setDialogState] = useState<dialogStates>("InputNumber");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sharedPhoneNumber, setSharedPhoneNumber] = useState("");

  const tPhoneNumber = useTranslations("phoneNumber");
  return (
    <AlertDialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <AlertDialogTrigger>
        <PhoneInput className={cn(className)} {...props} value={value} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex justify-between">
            {tPhoneNumber(`${dialogState}.title`)}
            <AlertDialogCancel className="text-foreground/50 hover:text-foreground/80">
              <X className="size-6" />
            </AlertDialogCancel>
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tPhoneNumber(`${dialogState}.description`)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputNumber
          className={cn(dialogState !== "InputNumber" && "hidden")}
          setDialogState={setDialogState}
          setSharedPhoneNumber={setSharedPhoneNumber}
        />
        <PhoneInputOTP
          className={cn(dialogState !== "OTP" && "hidden")}
          setDialogState={setDialogState}
          phoneNumber={sharedPhoneNumber}
          setIsDialogOpen={setIsDialogOpen}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UserPhoneButton;
