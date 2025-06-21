import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepper, utils } from "./stepper-config";

function StepperIndicator() {
  const { current, all } = useStepper();
  const tSell = useTranslations("/sell");

  const stepLabels = [
    tSell("stepper.step1"),
    tSell("stepper.step2"),
    tSell("stepper.step3"),
  ];

  return (
    <div className="mb-8 flex items-center justify-center">
      <div className="flex items-center space-x-3 sm:space-x-2">
        {all.map((step, index) => {
          const isActive = step.id === current.id;
          const isCompleted =
            utils.getIndex(step.id) < utils.getIndex(current.id);
          const isLast = index === all.length - 1;

          return (
            <div key={step.id} className="flex items-center justify-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                        ? "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <div className="mt-2">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : isCompleted
                          ? "text-primary"
                          : "text-muted-foreground",
                    )}
                  >
                    {stepLabels[index]}
                  </p>
                </div>
              </div>
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "mx-4 hidden h-0.5 w-16 transition-colors sm:block",
                    isCompleted ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepperIndicator;
