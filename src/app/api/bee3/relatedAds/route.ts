import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { NUMBER_OF_ADS_IN_CAROUSEL } from "@/consts/ad";

export async function GET(request: NextRequest) {
  const adId = request.nextUrl.searchParams.get("adId");
  const categoryPath = request.nextUrl.searchParams.get("categoryPath");

  if (!adId || !categoryPath) {
    return NextResponse.json({ status: 422 });
  }

  try {
    const relatedAds = await db.ad.findMany({
      where: {
        categoryPath: categoryPath,
        NOT: {
          id: adId,
        },
      },
      include: {
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      take: NUMBER_OF_ADS_IN_CAROUSEL,
    });

    return NextResponse.json({ relatedAds });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
