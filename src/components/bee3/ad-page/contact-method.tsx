type ContactMethodProps = {
  contactMethod: string;
  title: string;
};

export function ContactMethod({ contactMethod, title }: ContactMethodProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xl font-bold">{title}</div>
      <div className="text-lg">{contactMethod}</div>
    </div>
  );
}
