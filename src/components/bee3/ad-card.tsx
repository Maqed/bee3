import { getLocale } from "next-intl/server";
import { Heart } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Ad } from "@prisma/client";

async function AdCard({ ad }: { ad: Ad }) {
  const locale = await getLocale();
  return (
    <Card className="w-full max-w-[300px]">
      <CardContent className="p-0">
        <Image
          src={ad.images[0] ?? ""}
          alt={`${ad.title} image`}
          width="300"
          height="200"
          className="h-[200px] w-full rounded-t-lg object-cover"
          style={{ aspectRatio: "300/200", objectFit: "cover" }}
        />
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <h3 className="flex w-full items-center justify-between text-lg font-semibold text-primary">
              <span>
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: "EGP",
                }).format(ad.price)}
              </span>
              <Heart className="h-5 w-5 text-foreground/70 transition-all hover:text-red-500" />
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">{ad.title}</p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {/* Put actual data */}
            <span>AD PLACE</span>
            <span>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "long",
                //  Put the actual date below
              }).format(new Date())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdCard;
