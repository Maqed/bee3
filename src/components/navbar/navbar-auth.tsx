"use client";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
  onNavigate,
}: {
  session: typeof authClient.$Infer.Session | null;
  isPending: boolean;
  dropdownMenuContentProps?: DropdownMenuContentProps;
  loginButtonProps?: ButtonProps;
  trigger: ReactNode;
  onNavigate?: () => void;
}) {
  const t = useTranslations("Navbar");
  const router = useRouter();

  const handleMyAdsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.();
    // Use router.push instead of Link for my-ads specifically
    router.push("/my-ads");
    // Force a refresh to clear any stale state
    setTimeout(() => {
      router.refresh();
    }, 10);
  };

  const handleLinkClick = () => {
    onNavigate?.();
  };

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
        {/* Special handling for My Ads link */}
        <DropdownMenuItem onClick={handleMyAdsClick}>
          <Megaphone className="me-2 h-4 w-4" />
          {t("MyAds")}
        </DropdownMenuItem>

        <Link href={`/user/${session.user.id}`} onClick={handleLinkClick}>
          <DropdownMenuItem>
            <UserIcon className="me-2 h-4 w-4" />
            {t("Profile")}
          </DropdownMenuItem>
        </Link>
        {session.user.role === "admin" && (
          <Link href="/admin/ads" onClick={handleLinkClick}>
            <DropdownMenuItem>
              <Shield className="me-2 h-4 w-4" />
              {t("Admin")}
            </DropdownMenuItem>
          </Link>
        )}
        <Link href="/favorites" onClick={handleLinkClick}>
          <DropdownMenuItem>
            <Heart className="me-2 h-4 w-4" />
            {t("Favorites")}
          </DropdownMenuItem>
        </Link>
        <Link href="/user-settings" onClick={handleLinkClick}>
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
