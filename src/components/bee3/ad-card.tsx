import { getLocale } from "next-intl/server";
import { Heart } from "lucide-react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { type Ad } from "@prisma/client";
import { Link } from "@/navigation";
import { getLocalizedDate, getLocalizedPrice } from "@/lib/utils";

async function AdCard({ ad }: { ad: Ad }) {
  const locale = await getLocale();
  return (
    <Card className="w-[300px]">
      <CardContent className="p-0">
        <Link href={`/ad/${ad.id}`}>
          <Image
            src={ad.images[0] ?? ""}
            alt={`${ad.title} image`}
            width="300"
            height="200"
            className="h-[200px] w-full rounded-t-lg object-cover"
            style={{ aspectRatio: "300/200", objectFit: "cover" }}
          />
        </Link>
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <h3 className="flex w-full items-center justify-between text-lg font-semibold text-primary">
              <Link href={`/ad/${ad.id}`}>
                <span>{getLocalizedPrice(locale, ad.price)}</span>
              </Link>
              <Heart className="h-5 w-5 text-foreground/70 transition-all hover:text-red-500" />
            </h3>
          </div>
          <Link href={`/ad/${ad.id}`}>
            <p className="text-sm text-muted-foreground">{ad.title}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {/* Put actual data */}
              <span>AD PLACE</span>
              <span>{getLocalizedDate(locale, ad.createdAt)}</span>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdCard;
