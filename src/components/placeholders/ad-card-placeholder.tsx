import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  orientation?: "horizontal" | "vertical";
};

function AdCardPlaceholder({ orientation = "vertical" }: Props) {
  return (
    <Card
      className={cn(
        orientation === "vertical"
          ? "w-[225px] md:w-[275px] lg:w-[300px]"
          : "w-full",
      )}
    >
      <CardContent
        className={cn(
          "flex flex-col p-0",
          orientation === "horizontal" &&
            "md:h-full md:flex-row md:justify-between",
        )}
      >
        <Skeleton
          className={cn(
            "h-[200px] w-full rounded-t-lg",
            orientation === "horizontal" &&
              "md:h-full md:w-[300px] md:rounded-s-lg md:rounded-t-none",
          )}
        />
        <div
          className={cn(
            "space-y-2 p-4",
            orientation === "horizontal" &&
              "md:flex md:h-full md:w-full md:flex-col md:justify-between",
          )}
        >
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center justify-between text-sm">
            <Skeleton className="h-5 w-20" />
            <Skeleton
              className={cn("hidden h-5 w-28", {
                "md:block": orientation == "horizontal",
              })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdCardPlaceholder;
