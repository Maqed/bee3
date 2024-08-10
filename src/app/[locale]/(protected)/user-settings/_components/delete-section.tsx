"use client";
import { useRef } from "react";
import type { FormEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { deleteAccountAction } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TransitionStartFunction } from "react";
type Props = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

function DeleteAccountSection({ isPending, startTransition }: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("/user-settings");
  const confirmDeleteName = useRef<HTMLInputElement | null>(null);
  const confirmDeleteMessage = useRef<HTMLInputElement | null>(null);
  async function deleteAccount(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const response = await deleteAccountAction();
      await signOut();
      router.push(DEFAULT_UNAUTHENTICATED_REDIRECT);
      toast({
        variant: "destructive",
        title: t(response.message ?? response.error),
      });
    });
  }
  return (
    <section>
      <h1 className="text-3xl font-bold text-destructive">
        {t("delete-title")}
      </h1>
      <hr className="my-2" />
      <p className="mb-2">{t("delete-paragraph")}</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={isPending} variant="destructive">
            {t("delete-title")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete-dialog-title")}</DialogTitle>
            <DialogDescription>
              {t("delete-dialog-paragraph")}
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-y-3" onSubmit={deleteAccount}>
            <Label htmlFor="confirm-delete-name-input">
              {t("confirm-delete-name-input")}{" "}
              <span className="italic text-foreground/80">
                {session?.user.name}
              </span>
            </Label>
            <Input ref={confirmDeleteName} id="confirm-delete-name-input" />
            <Label htmlFor="confirm-delete-message-input">
              {t("confirm-delete-message-input")}{" "}
              <span className="italic text-foreground/80">
                delete my account
              </span>
            </Label>
            <Input
              ref={confirmDeleteMessage}
              id="confirm-delete-message-input"
            />
            <div className="flex flex-wrap gap-x-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit" variant="destructive">
                {t("delete-title")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default DeleteAccountSection;
