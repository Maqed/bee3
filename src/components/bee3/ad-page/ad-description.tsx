import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdWithUser } from "@/types/ad-page-types";

type DescriptionProps = {
  ad: AdWithUser;
  tAd: any;
};

export function AdDescription({ ad, tAd }: DescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tAd("description")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{ad.description}</p>
      </CardContent>
    </Card>
  );
}
