"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { getFirstLettersOfWords } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="flex h-16 items-center justify-between bg-background px-4 md:px-10">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <h1 className="text-lg font-semibold">Bee3Online</h1>
      </Link>
      <nav className="flex items-center gap-2">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar>
                <AvatarImage
                  src={session.user?.image}
                  alt={session.user?.name}
                />
                <AvatarFallback>
                  {getFirstLettersOfWords(session.user.name)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
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
          </>
        )}
      </nav>
    </header>
  );
}
