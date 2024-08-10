"use client";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { getFirstLettersOfWords } from "@/lib/utils";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";

function NavbarAuth() {
  const t = useTranslations("Navbar");
  const { data: session, status } = useSession();
  if (status === "loading")
    return <Skeleton className="h-10 w-10 rounded-full" />;
  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>{getFirstLettersOfWords(session.user.name)}</Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {t("Greeting")} {session.user.name} 👋
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/user-settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            {t("Settings")}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("Logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button size="sm" asChild>
        <Link href="/login">{t("Login")}</Link>
      </Button>
    </>
  );
}

export default NavbarAuth;
