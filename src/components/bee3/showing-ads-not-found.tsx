import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";

async function ShowingAdsNotFound() {
  const t = await getTranslations("search.not-found");
  return (
    <div className="flex flex-col items-center justify-center bg-background">
      <Search className="mx-auto h-12 w-12 text-primary" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-muted-foreground">{t("paragraph")}</p>
    </div>
  );
}

export default ShowingAdsNotFound;
