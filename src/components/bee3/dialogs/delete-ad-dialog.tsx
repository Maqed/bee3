import React, { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useDeleteAd } from "@/hooks/use-delete-ad";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";

function DeleteAdDialog({ adId }: { adId: string }) {
  const deleteAdMutation = useDeleteAd();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const t = useTranslations("dialogs.delete");
  const handleDeleteAd = async (adId: string) => {
    try {
      await deleteAdMutation.mutateAsync(adId);
      toast({
        title: t("toast.delete-success"),
        variant: "success",
      });
      setDeleteDialogOpen(null);
    } catch (error) {
      toast({
        title: t("toast.delete-error"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog
      open={deleteDialogOpen === adId}
      onOpenChange={(open) => setDeleteDialogOpen(open ? adId : null)}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setDeleteDialogOpen(adId);
          }}
          className="flex items-center gap-1 bg-destructive text-destructive-foreground focus:bg-destructive/90 focus:text-destructive-foreground"
        >
          <Trash2 className="size-4" />
          {t("trigger")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog-title")}</DialogTitle>
          <DialogDescription>{t("dialog-description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(null)}
            disabled={deleteAdMutation.isPending}
          >
            {t("dialog-cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteAd(adId)}
            disabled={deleteAdMutation.isPending}
          >
            {deleteAdMutation.isPending
              ? t("dialog-deleting")
              : t("dialog-delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAdDialog;
