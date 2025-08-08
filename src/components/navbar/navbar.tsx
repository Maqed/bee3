"use client";
import { Link } from "@/navigation";
import NavbarAuth from "./navbar-auth";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import SellButton from "../bee3/sell-button";
import AdSearchbox from "../bee3/search/ad-searchbox";
import Logo from "../bee3/logo";
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
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header className="glossy sticky top-0 z-50 mb-5 flex flex-col justify-between gap-1 border-b border-border/75 py-4">
      <div className="container flex items-center justify-between ps-10">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex flex-1 justify-center">
          <div className="mx-10 w-full max-w-lg lg:mx-0">
            <AdSearchbox />
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-x-5">
          <LocaleSwitcher RenderAs={Button} className="px-0 pe-3 text-base" />
          <SellButton className="hidden lg:flex" />
          <NavbarAuth
            trigger={
              <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar>{session?.user.name[0]}</Avatar>
              </DropdownMenuTrigger>
            }
            isPending={isPending}
            dropdownMenuContentProps={{
              align: "end",
              className: "w-64",
            }}
            loginButtonProps={{
              className: "font-bold text-base",
            }}
            session={session}
          />
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent className="w-64">
              <VisuallyHidden>
                <SheetHeader>
                  <SheetTitle>Navbar content</SheetTitle>
                </SheetHeader>
              </VisuallyHidden>
              <div className="flex h-full flex-col items-start justify-end gap-3">
                <LocaleSwitcher
                  RenderAs={Button}
                  className="w-full text-base"
                />
                <SellButton className="w-full" />
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
                  isPending={isPending}
                  dropdownMenuContentProps={{
                    align: "start",
                    side: "top",
                    sideOffset: 6,
                    className: "w-[200px]",
                  }}
                  session={session}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
