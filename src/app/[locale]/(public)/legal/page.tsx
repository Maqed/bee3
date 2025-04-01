import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSortedMarkdownData } from "@/lib/markdown";
import { getLocalizedTimeAgo } from "@/lib/utils";
import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ForwardArrow } from "@/components/ui/arrows";

function AllLegalPages() {
  const locale = useLocale();
  const t = useTranslations("/legal");
  const markdownData = getSortedMarkdownData(locale, "legal");

  return (
    <main className="container mx-auto max-w-4xl py-12">
      <h1 className="mb-8 text-3xl font-bold text-primary">{t("title")}</h1>

      <div className="grid gap-4">
        {markdownData.map(({ id, title, date, link }) => (
          <Link
            href={link}
            key={id}
            className="block transition-transform hover:translate-y-[-2px]"
          >
            <Card className="overflow-hidden border-s-4 border-s-primary transition-all duration-300 hover:shadow-md">
              <div className="flex items-stretch">
                <div className="hidden items-center justify-center bg-muted p-4 sm:flex">
                  <FileText className="h-8 w-8 text-primary" />
                </div>

                <div className="flex-1">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{title}</CardTitle>
                      <ForwardArrow className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription className="flex items-center gap-1 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {getLocalizedTimeAgo(locale, date)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground">
                      {t("viewDocument", { document: title?.toLowerCase() })}
                    </p>
                  </CardContent>

                  <CardFooter className="pb-4 pt-0">
                    <Badge variant="outline" className="text-xs">
                      {t("badge")}
                    </Badge>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        {t("footer")}
      </p>
    </main>
  );
}

export default AllLegalPages;
