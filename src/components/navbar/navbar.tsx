"use client";
import { Link } from "@/navigation";
import NavbarAuth from "./navbar-auth";
import LocaleSwitcher from "@/components/ui/locale-switcher";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between bg-background px-4 md:px-10">
      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Bee3Online</h1>
      </Link>
      <nav className="flex items-center gap-2">
        <LocaleSwitcher />
        <NavbarAuth />
      </nav>
    </header>
  );
}
