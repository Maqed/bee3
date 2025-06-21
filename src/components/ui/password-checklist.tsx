"use client";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type PasswordCheckListProps = {
  password: string;
};

export default function PasswordCheckList({
  password,
}: PasswordCheckListProps) {
  const t = useTranslations("password-checklist");
  const checkStrength = (pass: string) => {
    const requirements = [
      {
        regex: /.{8,}/,
        text: t("messages.min-password-characters"),
      },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return t("strength-text.enter");
    return t("strength-text.strong");
  };

  return (
    <div>
      {/* Password strength indicator */}
      <div
        className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-label={t("aria-label")}
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 1) * 100}%` }}
        ></div>
      </div>

      {/* Password strength description */}
      <p className="mb-2 text-sm font-medium text-foreground">
        {getStrengthText(strengthScore)}. {t("must-contain")}
      </p>

      {/* Password requirements list */}
      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check
                size={16}
                className="text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <X
                size={16}
                className="text-muted-foreground/80"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              {req.text}
              <span className="sr-only">
                {req.met ? t("req.met") : t("req.not-met")}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
