import React, { ComponentType } from "react";
import { Button, ButtonProps } from "../../ui/button";
import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";

function ContactButton({
  title,
  Icon,
  variant,
  children,
  showTitle,
  className,
  ...props
}: ButtonProps & {
  Icon: ComponentType<LucideProps>;
  title: string;
  showTitle: boolean;
}) {
  return (
    <Button
      size={showTitle ? "default" : "icon"}
      className={cn(
        {
          "w-full": showTitle,
        },
        className,
      )}
      {...props}
      variant={variant}
    >
      <Icon
        className={cn("size-6", {
          "me-1": showTitle,
        })}
      />
      {showTitle && title}
    </Button>
  );
}

export default ContactButton;
