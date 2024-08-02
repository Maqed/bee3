import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export default function HeaderComponent({ label }: HeaderProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <h1 className={cn("text-3xl font-semibold", poppinsFont.className)}>
        Bee3Online
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
