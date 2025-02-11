import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SafetyTipsCard({ className }: { className?: string }) {
  const t = useTranslations("/ad/[adId].safety-tips");
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-1 text-xl font-semibold">
          <Shield className="size-6 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-foreground/90">
          {[
            "public-place",
            "bring-companion",
            "inspect-product",
            "no-advance-payment",
          ].map((tip) => (
            <li className="flex gap-2">
              <span className="select-none">•</span>
              {t(`tips.${tip}`)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
