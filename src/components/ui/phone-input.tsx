"use client";
import { Input, InputProps } from "./input";
import { cn } from "@/lib/utils";

export type PhoneInputProps = {} & InputProps;

function PhoneInput({ className, ...props }: PhoneInputProps) {
  return (
    // Make sure that the direction is ltr for better UX
    <div dir="ltr" className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/70">
        +20
      </span>
      <Input
        className={cn("pl-10", className)}
        maxLength={10}
        type="tel"
        {...props}
      />
    </div>
  );
}

export default PhoneInput;
