"use client";
import * as RadixCheckbox from "@radix-ui/react-checkbox";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

type CheckboxProps = React.CustomComponentPropsWithRef<
  typeof RadixCheckbox.Root
>;

export function Checkbox({ checked, className, ...props }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      {...props}
      className={cn(
        "relative inline-block size-6 appearance-none rounded border border-primary bg-muted",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        <RadixCheckbox.Indicator
          className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-primary"
          asChild
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.3,
              ease: [0.175, 0.885, 0.32, 1.1],
            }}
          >
            <CheckIcon checkedState={checked} />
          </motion.div>
        </RadixCheckbox.Indicator>
      </AnimatePresence>
    </RadixCheckbox.Root>
  );
}

type CheckIconProps = {
  checkedState: CheckboxProps["checked"];
};

function CheckIcon({ checkedState }: CheckIconProps) {
  const CHECK_PATH = "M5 13 L10 18 L20 6";
  const INDETERMINATE_PATH = "M6 12 H18";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="scale-65 shrink-0 stroke-primary-foreground stroke-2"
    >
      <title>Check</title>

      <motion.path
        d={checkedState === "indeterminate" ? INDETERMINATE_PATH : CHECK_PATH}
        initial={{
          pathLength: 0,
        }}
        animate={{
          pathLength: 1,
        }}
        transition={{
          duration: 0.3,
          ease: [0.645, 0.045, 0.355, 1],
        }}
      />
    </svg>
  );
}
