import { Link } from "@/navigation";
import NavbarAuth from "./navbar-auth";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import ModeToggle from "@/components/ui/mode-toggle";
import SellButton from "../bee3/sell-button";
import AdSearch from "../bee3/search/ad-searchbox";
import Logo from "../bee3/logo";
import { getServerAuthSession } from "@/lib/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Avatar } from "@/components/ui/avatar";
import { ChevronsUpDown, Menu } from "lucide-react";
import { DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { getLocale } from "next-intl/server";

export default async function Navbar() {
  const session = await getServerAuthSession();
  const locale = await getLocale();
  return (
    <header className="container sticky top-0 z-50 mb-5 flex flex-col justify-between gap-1 border-b bg-background py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="min-w-1/2 flex items-center gap-x-2">
          <AdSearch />
          <div className="hidden md:flex md:items-center md:gap-x-2">
            <LocaleSwitcher />
            <SellButton className="hidden md:flex" />
            <ModeToggle />
            <NavbarAuth
              trigger={
                <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar>{session?.user.name[0]}</Avatar>
                </DropdownMenuTrigger>
              }
              session={session}
            />
          </div>
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <VisuallyHidden>
                <SheetHeader>
                  <SheetTitle>Navbar content</SheetTitle>
                </SheetHeader>
              </VisuallyHidden>
              <div className="flex h-full flex-col items-start justify-end gap-3">
                <ModeToggle showToggleThemeText={true} className="w-full" />
                <SellButton className="w-full" />
                <LocaleSwitcher className="w-full" />
                <NavbarAuth
                  trigger={
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex w-full items-center justify-between"
                      >
                        <ChevronsUpDown className="me-auto size-4" />
                        <span className="truncate font-semibold">
                          {session?.user.name}
                        </span>
                        <Avatar className="ms-2 h-8 w-8 rounded-lg">
                          {session?.user.name[0]}
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                  }
                  dropdownMenuContentProps={{
                    align: "start",
                    side: locale == "en" ? "left" : "right",
                    sideOffset: 6,
                  }}
                  session={session}
                />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
