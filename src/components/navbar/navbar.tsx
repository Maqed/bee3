"use client";
import { Link } from "@/navigation";
import { Menu } from "lucide-react";
import NavbarAuth from "./navbar-auth";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ModeToggle from "@/components/ui/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SellButton from "../bee3/sell-button";
import AdSearch from "../bee3/search/ad-search";
import Logo from "../bee3/logo";

export default function Navbar() {
  return (
    <header className="container sticky top-0 z-50 mb-5 flex flex-col justify-between gap-1 border-b bg-background py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-primary">
            <Logo />
          </h1>
        </Link>
        <nav className="flex items-center gap-x-2">
          {/* Shown in desktop, Hidden in mobile */}
          <div className="flex items-center gap-x-2 max-md:hidden">
            <LocaleSwitcher />
          </div>
          <SellButton className="hidden md:flex" />
          <ModeToggle />
          <NavbarAuth />
          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent className="pt-10">
              <VisuallyHidden>
                <SheetHeader>
                  <SheetTitle>Nav Links</SheetTitle>
                </SheetHeader>
              </VisuallyHidden>
              {/* Shown in mobile, Hidden in desktop */}
              <LocaleSwitcher />
            </SheetContent>
          </Sheet>
        </nav>
      </div>
      <div className="flex items-center justify-center">
        <AdSearch />
      </div>
    </header>
  );
}
