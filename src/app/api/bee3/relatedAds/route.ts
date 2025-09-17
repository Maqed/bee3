import { NextRequest, NextResponse } from "next/server";
import { NUMBER_OF_ADS_IN_CAROUSEL } from "@/consts/ad";
import { getAcceptedAdsFromNonBannedUsers } from "@/database/ad";

export async function GET(request: NextRequest) {
  const adId = request.nextUrl.searchParams.get("adId");
  const categoryPath = request.nextUrl.searchParams.get("categoryPath");

  if (!adId || !categoryPath) {
    return NextResponse.json({ status: 422 });
  }

  try {
    // Decode URL-encoded adId to handle Arabic characters
    const decodedAdId = decodeURIComponent(adId);
    const relatedAds = await getAcceptedAdsFromNonBannedUsers({
      where: {
        categoryPath: categoryPath,
        NOT: {
          id: decodedAdId,
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
