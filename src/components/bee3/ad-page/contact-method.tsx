import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IoMdContact } from "react-icons/io";

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

export function MobileContactMethod({
  contactMethod,
  title,
}: ContactMethodProps) {
  return (
    <Card className="glossy fixed bottom-0 left-0 z-50 w-full md:hidden">
      <CardContent className="flex items-center justify-center p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon">
              <IoMdContact className="size-6" />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <ContactMethod contactMethod={contactMethod} title={title} />{" "}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
