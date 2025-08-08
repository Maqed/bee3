"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Users } from "lucide-react";
import Logo from "../bee3/logo";
import { AdminNavUser } from "./admin-nav-user";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";

export function AdminSidebar() {
  const locale = useLocale();
  const t = useTranslations("Admin.Navigation");
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const navigationItems = [
    {
      title: t("Ads"),
      href: `/admin/ads`,
      icon: FileText,
    },
    {
      title: t("Users"),
      href: `/admin/users`,
      icon: Users,
    },
  ];

  return (
    <Sidebar side={locale === "ar" ? "right" : "left"}>
      <SidebarHeader>
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!isSessionPending && session ? (
          <AdminNavUser user={session.user} />
        ) : (
          <Skeleton className="h-10 w-full" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
