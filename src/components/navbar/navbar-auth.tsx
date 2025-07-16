"use client";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import {
  Settings,
  User as UserIcon,
  Heart,
  Shield,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import SignOutMenuItem from "./sign-out-menu-item";
import { ReactNode } from "react";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

function NavbarAuth({
  session,
  isPending,
  dropdownMenuContentProps,
  loginButtonProps,
  trigger,
}: {
  session: typeof authClient.$Infer.Session | null;
  isPending: boolean;
  dropdownMenuContentProps?: DropdownMenuContentProps;
  loginButtonProps?: ButtonProps;
  trigger: ReactNode;
}) {
  const t = useTranslations("Navbar");
  if (isPending) return <Skeleton className="h-11 w-24" />;
  if (!session)
    return (
      <Button size="lg" {...loginButtonProps} asChild>
        <Link href="/login">{t("Login")}</Link>
      </Button>
    );
  return (
    <DropdownMenu>
      {trigger}
      <DropdownMenuContent
        {...dropdownMenuContentProps}
        className={cn("p-0", dropdownMenuContentProps?.className)}
      >
        <DropdownMenuLabel>
          <h5 className="text-lg">{t("Greeting")} 👋</h5>
          <h4 className="text-xl text-primary">{session.user.name}</h4>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/my-ads`}>
          <DropdownMenuItem>
            <Megaphone className="me-2 h-4 w-4" />
            {t("MyAds")}
          </DropdownMenuItem>
        </Link>
        <Link href={`/user/${session.user.id}`}>
          <DropdownMenuItem>
            <UserIcon className="me-2 h-4 w-4" />
            {t("Profile")}
          </DropdownMenuItem>
        </Link>
        {session.user.role === "admin" && (
          <Link href="/admin/users">
            <DropdownMenuItem>
              <Shield className="me-2 h-4 w-4" />
              {t("Admin")}
            </DropdownMenuItem>
          </Link>
        )}
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
        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarAuth;
