type ContactInfoProps = {
  contactInfo: string;
  title: string;
};

export function ContactInfo({ contactInfo, title }: ContactInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xl font-bold">{title}</div>
      <div className="text-lg">{contactInfo}</div>
    </div>
  );
}
