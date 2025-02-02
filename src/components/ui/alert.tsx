import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex flex-col gap-x-2 w-full rounded-md p-3 text-sm",
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
  message?: string;
  description?: string;
}

function Alert({
  className,
  variant,
  message,
  description,
  ...props
}: AlertProps) {
  if (!message) return null;
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <h6 className="font-bol flex items-center gap-1 text-base font-bold">
        {variant === "success" && <CheckCircle2 className="inline size-5" />}
        {variant === "destructive" && <X className="inline size-5" />}
        {message}
      </h6>
      <p>{description}</p>
    </div>
  );
}

export { Alert, alertVariants };
