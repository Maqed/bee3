"use client";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "@/navigation";

function SignOutMenuItem({ title }: { title: string }) {
  const router = useRouter();
  return (
    <DropdownMenuItem
      className="bg-destructive text-destructive-foreground focus:bg-destructive/70 focus:text-destructive-foreground"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.refresh();
            },
          },
        })
      }
    >
      <LogOut className="me-2 h-4 w-4" />
      {title}
    </DropdownMenuItem>
  );
}

export default SignOutMenuItem;
