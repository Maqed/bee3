import React from "react";
import ContactButton from "./contact-button";
import { useTranslations } from "next-intl";
import Whatsapp from "@/components/icons/whatsapp";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

function WhatsAppButton({
  phoneNumber,
  showTitle,
  className,
}: {
  phoneNumber: string;
  showTitle: boolean;
  className?: string;
}) {
  const tUser = useTranslations("/ad/[adId].user");
  return (
    <Link
      href={`https://api.whatsapp.com/send?phone=${phoneNumber.startsWith("+") ? phoneNumber.substring(1) : phoneNumber}`}
      target="_blank"
      className={cn({ "w-full": showTitle })}
    >
      <ContactButton
        variant="whatsapp"
        Icon={Whatsapp}
        title={tUser("whatsapp")}
        showTitle={showTitle}
        className={className}
      />
    </Link>
  );
}

export default WhatsAppButton;
