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
import { Menu } from "lucide-react";

export default async function Navbar() {
  const session = await getServerAuthSession();
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
            <NavbarAuth session={session} />
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
              <div className="flex h-full flex-col items-center justify-end gap-3 py-10">
                <ModeToggle />
                <SellButton />
                <LocaleSwitcher />
                <NavbarAuth session={session} />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
