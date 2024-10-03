import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex items-center gap-x-2 w-full rounded-md p-3 text-sm",
  {
    variants: {
      variant: {
        success: "bg-success/15 text-success",
        destructive: "bg-destructive/15 text-destructive",
      },
    },
  },
);

export interface AlertProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  message: string | undefined;
}

function Alert({ className, variant, message, ...props }: AlertProps) {
  if (!message) return null;
  return (
    <div className={cn(alertVariants({ variant, className }))} {...props}>
      {variant === "success" && <CheckCircle2 className="h-4 w-4" />}
      {variant === "destructive" && <X className="h-4 w-4" />}
      <p>{message}</p>
    </div>
  );
}

export { Alert, alertVariants };
