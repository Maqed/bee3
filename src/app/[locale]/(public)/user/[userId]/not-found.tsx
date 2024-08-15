import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { FrownIcon } from "lucide-react";
async function UserNotFound() {
  const t = await getTranslations("/user/[userId].not-found");
  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <FrownIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t("paragraph")}</p>
        <div className="mt-6">
          <Button>
            <Link href="/">{t("link")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserNotFound;
