"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
