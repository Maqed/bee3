import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import type { CategoryIconType } from "@/consts/category-icons";
import { FormLabel } from "@/components/ui/form";
import { Avatar } from "@/components/ui/avatar";

const CategoryRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    Icon: CategoryIconType;
    categoryName: string;
  }
>(({ className, categoryName, Icon, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "group text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <FormLabel
          className={cn(
            "text-sm font-medium",
            "group text-foreground transition-colors group-data-[state=checked]:text-primary",
            "flex flex-col items-center justify-center gap-2",
          )}
        >
          <Avatar className="rounded-md bg-accent text-foreground drop-shadow-md group-data-[state=checked]:bg-primary/70 group-data-[state=checked]:drop-shadow">
            <Icon />
          </Avatar>
          {categoryName}
        </FormLabel>
      </RadioGroupPrimitive.Item>
    </div>
  );
});

CategoryRadioItem.displayName = "CategoryRadioItem";

export default CategoryRadioItem;
