import type { AdWithUser } from "@/types/ad-page-types";
import { useTranslations } from "next-intl";

type AdAttributesProps = {
  ad: AdWithUser;
};

export function AdAttributes({ ad }: AdAttributesProps) {
  const tCategory = useTranslations("category");
  // Filter out empty attribute values
  const attributes = ad.attributeValues?.filter(
    (attrValue) => attrValue.value && attrValue.value.trim() !== "",
  );

  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold">
        {tCategory("options.label")}
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:[&>*:nth-child(4n+1)]:bg-accent md:[&>*:nth-child(4n+1)]:text-accent-foreground md:[&>*:nth-child(4n+2)]:bg-accent md:[&>*:nth-child(4n+2)]:text-accent-foreground max-md:[&>*:nth-child(odd)]:bg-accent max-md:[&>*:nth-child(odd)]:text-accent-foreground">
        {attributes.map((attrValue) => (
          <div
            key={attrValue.id}
            className="flex items-center justify-between border-b border-border/50 p-3 last:border-b-0"
          >
            <span className="font-medium text-muted-foreground">
              {tCategory(`options.attributes.${attrValue.attribute.name}`) ||
                attrValue.attribute.name}
            </span>
            <span className="font-semibold">
              {attrValue.attribute.type === "select"
                ? tCategory(`options.values.${attrValue.value}`) ||
                  attrValue.value
                : attrValue.value}
              {attrValue.attribute.unit && (
                <span className="ml-1 font-normal text-muted-foreground">
                  {attrValue.attribute.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
