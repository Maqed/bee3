"use client";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import PrefixLabelledInput from "./prefix-labelled-input";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export type PhoneInputProps = Omit<PatternFormatProps, "format">;

function PhoneInput({ className, ...props }: PhoneInputProps) {
  return (
    <PrefixLabelledInput
      prefix={"+20"}
      dir="ltr"
      input={
        <PatternFormat
          className={cn("pl-10", className)}
          allowEmptyFormatting
          mask="_"
          customInput={Input}
          format="### ### ####"
          {...props}
        />
      }
    />
  );
}

export default PhoneInput;
