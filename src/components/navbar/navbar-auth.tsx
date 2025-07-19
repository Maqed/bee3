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
import { PiUserCircleFill } from "react-icons/pi";

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
  if (isPending) return <Skeleton className="size-10 rounded-full" />;
  if (!session)
    return (
      <Button
        size="icon"
        variant="ghost"
        {...loginButtonProps}
        className={cn(
          "border-none text-secondary hover:text-secondary",
          loginButtonProps?.className,
        )}
        asChild
      >
        <Link href="/login">
          <PiUserCircleFill className="size-8 fill-secondary" />
        </Link>
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
          <h5 className="text-xl">{t("Greeting")} 👋</h5>
          <h4 className="text-2xl text-primary">{session.user.name}</h4>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/my-ads`}>
          <DropdownMenuItem className="text-lg">
            <Megaphone className="me-2 size-5" />
            {t("MyAds")}
          </DropdownMenuItem>
        </Link>
        <Link href={`/user/${session.user.id}`}>
          <DropdownMenuItem className="flex items-center text-lg">
            <UserIcon className="me-2 size-5" />
            {t("Profile")}
          </DropdownMenuItem>
        </Link>
        {session.user.role === "admin" && (
          <Link href="/admin/ads">
            <DropdownMenuItem className="flex items-center text-lg">
              <Shield className="me-2 size-5" />
              {t("Admin")}
            </DropdownMenuItem>
          </Link>
        )}
        <Link href="/favorites">
          <DropdownMenuItem className="flex items-center text-lg">
            <Heart className="me-2 size-5" />
            {t("Favorites")}
          </DropdownMenuItem>
        </Link>
        <Link href="/user-settings">
          <DropdownMenuItem className="flex items-center text-lg">
            <Settings className="me-2 size-5" />
            {t("Settings")}
          </DropdownMenuItem>
        </Link>
        <SignOutMenuItem
          iconClassName="size-5"
          className="flex items-center text-lg"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarAuth;
