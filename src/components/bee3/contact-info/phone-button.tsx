"use client";
import React, { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import ContactButton from "./contact-button";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

function PhoneButton({
  phoneNumber,
  showTitle,
}: {
  phoneNumber: string;
  showTitle: boolean;
}) {
  const [isNumberShown, setIsNumberShown] = useState(!showTitle);
  const [copy, isCopied] = useCopyToClipboard();
  const { toast } = useToast();
  const tUser = useTranslations("/ad/[adId].user");
  const tClipboard = useTranslations("clipboard");
  return (
    <ContactButton
      Icon={Phone}
      showTitle={showTitle}
      onClick={() => {
        setIsNumberShown(true);
        if (isNumberShown) {
          copy(phoneNumber).then(() =>
            toast({
              title: tClipboard("copied", { text: phoneNumber }),
            }),
          );
        }
      }}
      title={isNumberShown ? phoneNumber : tUser("phone-number")}
    />
  );
}

export default PhoneButton;
