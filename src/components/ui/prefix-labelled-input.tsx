import { ReactNode } from "react";

export default function PrefixLabelledInput({
  prefix,
  input,
  ...props
}: {
  prefix: ReactNode;
  input: ReactNode;
} & React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="*:not-first:mt-2">
      <div className="relative">
        {input}
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
          {prefix}
        </span>
      </div>
    </div>
  );
}
