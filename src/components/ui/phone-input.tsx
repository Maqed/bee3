"use client";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export type PhoneInputProps = Omit<PatternFormatProps, "format">;

function PhoneInput({ className, ...props }: PhoneInputProps) {
  return (
    // Make sure that the direction is ltr for better UX
    <div dir="ltr" className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/70">
        +20
      </span>
      <PatternFormat
        className={cn("pl-10", className)}
        allowEmptyFormatting
        mask="_"
        customInput={Input}
        format="### ### ####"
        {...props}
      />
    </div>
  );
}

export default PhoneInput;
