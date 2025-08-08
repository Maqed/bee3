"use client";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function SignOutMenuItem({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  const router = useRouter();
  const t = useTranslations("Navbar");
  return (
    <DropdownMenuItem
      className={cn(
        "bg-destructive text-destructive-foreground focus:bg-destructive/70 focus:text-destructive-foreground",
        className,
      )}
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        })
      }
    >
      <LogOut className={cn("me-2 h-4 w-4", iconClassName)} />
      {t("Logout")}
    </DropdownMenuItem>
  );
}

export default SignOutMenuItem;
