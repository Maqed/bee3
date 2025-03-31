"use client";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Settings, User as UserIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Session, User } from "better-auth";
import SignOutMenuItem from "./sign-out-menu-item";
import { ReactNode } from "react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";

function NavbarAuth({
  session,
  dropdownMenuContentProps,
  trigger,
}: {
  session: { session: Session; user: User } | null;
  dropdownMenuContentProps?: DropdownMenuContentProps;
  trigger: ReactNode;
}) {
  const t = useTranslations("Navbar");
  if (!session)
    return (
      <Button size="sm" asChild>
        <Link href="/login">{t("Login")}</Link>
      </Button>
    );
  return (
    <DropdownMenu>
      {trigger}
      <DropdownMenuContent {...dropdownMenuContentProps} className="p-0">
        <DropdownMenuLabel>
          <h5 className="text-lg">{t("Greeting")} 👋</h5>
          <h4 className="text-xl text-primary">{session.user.name}</h4>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/user/${session.user.id}`}>
          <DropdownMenuItem>
            <UserIcon className="me-2 h-4 w-4" />
            {t("Profile")}
          </DropdownMenuItem>
        </Link>
        <Link href="/favorites">
          <DropdownMenuItem>
            <Heart className="me-2 h-4 w-4" />
            {t("Favorites")}
          </DropdownMenuItem>
        </Link>
        <Link href="/user-settings">
          <DropdownMenuItem>
            <Settings className="me-2 h-4 w-4" />
            {t("Settings")}
          </DropdownMenuItem>
        </Link>
        <SignOutMenuItem title={t("Logout")} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarAuth;
