"use client";
import { Link } from "@/navigation";
import { Menu } from "lucide-react";
import NavbarAuth from "./navbar-auth";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between bg-background px-4 md:px-10">
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Bee3Online</h1>
      </Link>
      <nav className="flex items-center gap-x-2">
        {/* Shown in desktop, Hidden in mobile */}
        <div className="flex items-center gap-x-2 max-md:hidden">
          <LocaleSwitcher />
        </div>
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
    </header>
  );
}
