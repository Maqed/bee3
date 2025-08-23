"use client";
import React from "react";
import DeleteAdDialog from "../dialogs/delete-ad-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

function ManageAd({ adId }: { adId: string }) {
  const t = useTranslations("/ad/[adId].manage-ad");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DeleteAdDialog
          DialogTriggerComponent={Button}
          adId={adId}
          triggerProps={{
            variant: "destructive",
            className: "w-full",
          }}
        />
      </CardContent>
    </Card>
  );
}

export default ManageAd;
