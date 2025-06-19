"use client";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button, type ButtonProps } from "./button";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

function CopyToClipboardButton({
  toBeCopiedText,
  className,
  copyText,
  copiedText,
  icon = "copy",
  ...props
}: {
  toBeCopiedText: string;
  className?: string;
  copyText: string;
  copiedText: string;
  icon?: "copy" | "share";
} & ButtonProps) {
  const [copy, isCopied] = useCopyToClipboard(3000);
  return (
    <Button
      type="button"
      className={cn(
        "gap-2 border-primary text-lg hover:bg-primary/5",
        className,
      )}
      onClick={() => copy(toBeCopiedText)}
      size="lg"
      {...props}
    >
      {isCopied ? (
        <Check className="size-6 text-primary" />
      ) : icon == "copy" ? (
        <Copy className="size-6 text-primary" />
      ) : (
        <Share2 className="size-6 text-primary" />
      )}
      {isCopied ? copiedText : copyText}
    </Button>
  );
}

export default CopyToClipboardButton;
