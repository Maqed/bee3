"use client";
import { Link } from "@/navigation";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { Settings, LogOut, User, Heart } from "lucide-react";
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
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  if (isPending) return <Skeleton className="h-10 w-10 rounded-full" />;
  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
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
            <User className="me-2 h-4 w-4" />
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
        <DropdownMenuItem
          className="bg-destructive text-destructive-foreground focus:bg-destructive/70 focus:text-destructive-foreground"
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push(DEFAULT_UNAUTHENTICATED_REDIRECT);
                },
              },
            })
          }
        >
          <LogOut className="me-2 h-4 w-4" />
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
