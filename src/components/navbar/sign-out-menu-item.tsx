"use client";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

function SignOutMenuItem() {
  const router = useRouter();
  const t = useTranslations("Navbar");
  return (
    <DropdownMenuItem
      className="bg-destructive text-destructive-foreground focus:bg-destructive/70 focus:text-destructive-foreground"
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
      <LogOut className="me-2 h-4 w-4" />
      {t("Logout")}
    </DropdownMenuItem>
  );
}

export default SignOutMenuItem;
