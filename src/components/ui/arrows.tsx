"use client";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export const ForwardArrow = ({ className, ...props }: LucideProps) => {
  const locale = useLocale();
  return (
    <ArrowRight
      className={cn(
        {
          "rotate-180": locale === "ar",
        },
        className,
      )}
      {...props}
    />
  );
};

export const BackwardArrow = ({ className, ...props }: LucideProps) => {
  const locale = useLocale();
  return (
    <ArrowLeft
      className={cn(
        {
          "rotate-180": locale === "ar",
        },
        className,
      )}
      {...props}
    />
  );
};
