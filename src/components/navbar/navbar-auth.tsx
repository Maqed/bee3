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
import { Avatar } from "@/components/ui/avatar";
import { Session, User } from "better-auth";
import SignOutMenuItem from "./sign-out-menu-item";

function NavbarAuth({
  session,
}: {
  session: { session: Session; user: User } | null;
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
      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar>{session.user.name[0]}</Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
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
