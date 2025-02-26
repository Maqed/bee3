import React from "react";
import {
  Button,
  ButtonProps as ReactEmailButtonProps,
} from "@react-email/components";
import { ButtonProps as ShadCnButtonProps } from "../ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

function EmailButton({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: ReactEmailButtonProps & ShadCnButtonProps) {
  return (
    <Button
      {...props}
      className={cn(buttonVariants({ size, variant, className }))}
    >
      {children}
    </Button>
  );
}

export default EmailButton;
