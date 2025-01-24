import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  orientation?: "horizontal" | "vertical";
};

function AdCardPlaceholder({ orientation = "vertical" }: Props) {
  return (
    <Card className={cn(orientation === "vertical" ? "w-[300px]" : "w-full")}>
      <CardContent
        className={cn(
          "flex p-0",
          orientation === "vertical" ? "flex-col" : "h-full justify-between",
        )}
      >
        <Skeleton
          className={cn(
            orientation === "vertical"
              ? "h-[200px] w-full rounded-t-lg"
              : "h-full w-[300px] rounded-s-lg",
          )}
        />
        <div
          className={cn(
            "space-y-2 p-4",
            orientation === "horizontal" &&
              "flex h-full w-full flex-col justify-between",
          )}
        >
          <div className="flex w-full items-center justify-between">
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center justify-between text-sm">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdCardPlaceholder;
