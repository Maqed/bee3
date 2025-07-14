"use client";
import { useLocale } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ForwardChevron = ({ className, ...props }: LucideProps) => {
  const locale = useLocale();
  return (
    <ChevronRight
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

export const BackwardChevron = ({ className, ...props }: LucideProps) => {
  const locale = useLocale();
  return (
    <ChevronLeft
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

export const ForwardChevrons = ({ className, ...props }: LucideProps) => {
  const locale = useLocale();
  return (
    <ChevronsRight
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

export const BackwardChevrons = ({ className, ...props }: LucideProps) => {
  const locale = useLocale();
  return (
    <ChevronsLeft
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
