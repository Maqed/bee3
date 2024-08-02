import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Navbar() {
  return (
    <header className="bg-background flex h-16 items-center justify-between px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <h1 className="text-lg font-semibold">Bee3Online</h1>
      </Link>
      <nav className="flex items-center gap-2">
        <Button size="sm" variant="secondary" asChild>
          <Link href="/login" prefetch={false}>
            Login
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/register" prefetch={false}>
            Register
          </Link>
        </Button>
      </nav>
    </header>
  );
}
