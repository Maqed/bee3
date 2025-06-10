"use client";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FilterAds from "./filter-ads";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  categoryPath?: string[];
};

function AdFilterDialog({ categoryPath }: Props) {
  const t = useTranslations("");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="lg:hidden" asChild>
        <Button className="text-base">
          {t("filter-ads.title")}
          <SlidersHorizontal className="ms-1 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <VisuallyHidden>
        <DialogTitle>Filter Ads Dialog</DialogTitle>
        <DialogDescription>
          This dialog filters ads by specific values such as minimum and maximum
          price, sorting by date or price and ordering descendingly or
          ascendingly
        </DialogDescription>
      </VisuallyHidden>
      <DialogContent className="h-full w-full flex-1 overflow-y-auto">
        <FilterAds
          categoryPath={categoryPath}
          onApplyFilter={() => {
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default AdFilterDialog;
