import { Link } from "@/navigation";
import NavbarAuth from "./navbar-auth";
import LocaleSwitcher from "@/components/ui/locale-switcher";
import ModeToggle from "@/components/ui/mode-toggle";
import SellButton from "../bee3/sell-button";
import AdSearch from "../bee3/search/ad-searchbox";
import Logo from "../bee3/logo";
import { getServerAuthSession } from "@/lib/auth";

export default async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <header className="container sticky top-0 z-50 mb-5 flex flex-col justify-between gap-1 border-b bg-background py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-primary">
            <Logo />
          </h1>
        </Link>
        <nav className="flex items-center gap-x-2">
          <LocaleSwitcher />
          <SellButton className="hidden md:flex" />
          <ModeToggle />
          <NavbarAuth session={session} />
        </nav>
      </div>
      <div className="flex items-center justify-center">
        <AdSearch />
      </div>
    </header>
  );
}
