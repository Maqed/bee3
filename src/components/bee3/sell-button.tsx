import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SellButton({ className }: { className?: string }) {
  const t = useTranslations("");
  return (
    <Button asChild className={cn("text-base font-bold", className)} size="lg">
      <Link href="/sell">{t("Sell")}</Link>
    </Button>
  );
}

export default SellButton;
