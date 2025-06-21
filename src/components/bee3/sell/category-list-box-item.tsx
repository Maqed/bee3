import * as React from "react";
import { cn } from "@/lib/utils";
import type { CategoryIconType } from "@/consts/category-icons";
import { FormLabel } from "@/components/ui/form";
import { Avatar } from "@/components/ui/avatar";
import { ListboxItem } from "@/components/ui/listbox";

const CategoryListboxItem = React.forwardRef<
  React.ElementRef<typeof ListboxItem>,
  React.ComponentPropsWithoutRef<typeof ListboxItem> & {
    Icon: CategoryIconType;
    categoryName: string;
  }
>(({ className, categoryName, Icon, ...props }, ref) => {
  return (
    <ListboxItem
      ref={ref}
      className={cn(
        "group items-center justify-center p-3 text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <FormLabel
        className={cn(
          "text-xs font-medium sm:text-sm",
          "group text-foreground transition-colors group-aria-selected:text-primary",
          "flex flex-col items-center justify-center gap-2",
          "min-w-[80px] sm:min-w-[100px]",
        )}
      >
        <Avatar className="h-8 w-8 rounded-md bg-accent text-foreground drop-shadow-md group-aria-selected:bg-primary/70 group-aria-selected:drop-shadow sm:h-10 sm:w-10">
          <Icon className="size-[14px] sm:size-[18px]" />
        </Avatar>
        <span className="text-center leading-tight">{categoryName}</span>
      </FormLabel>
    </ListboxItem>
  );
});

CategoryListboxItem.displayName = "CategoryListboxItem";

export default CategoryListboxItem;
