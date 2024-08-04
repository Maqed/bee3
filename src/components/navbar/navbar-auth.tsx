"use client";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { getFirstLettersOfWords } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function NavbarAuth() {
  const t = useTranslations("Navbar");
  const { data: session, status } = useSession();
  if (status === "loading")
    return <Skeleton className="h-10 w-10 rounded-full" />;
  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={session.user?.image} alt={session.user?.name} />
          <AvatarFallback>
            {getFirstLettersOfWords(session.user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("Logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button size="sm" variant="secondary" asChild>
        <Link href="/login">{t("Login")}</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">{t("Register")}</Link>
      </Button>
    </>
  );
}

export default NavbarAuth;
