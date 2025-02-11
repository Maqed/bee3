"use client";
import PhoneButton from "@/components/bee3/contact-info/phone-button";
import WhatsAppButton from "@/components/bee3/contact-info/whatsapp-button";

type ContactInfoProps = {
  showTitle: boolean;
  phoneNumber: string;
  className?: string;
};

export function ContactInfo({
  showTitle,
  phoneNumber,
  className,
}: ContactInfoProps) {
  return (
    <div className={className}>
      <PhoneButton showTitle={showTitle} phoneNumber={phoneNumber} />
      <WhatsAppButton showTitle={showTitle} phoneNumber={phoneNumber} />
    </div>
  );
}

export function MobileContactInfo({ phoneNumber }: { phoneNumber: string }) {
  return (
    <div className="fixed bottom-0 start-0 flex w-full items-center justify-center border-t bg-background py-3 md:hidden">
      <ContactInfo
        className="flex gap-3"
        showTitle={false}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}
