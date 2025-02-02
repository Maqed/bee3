import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

/**
 * q ----> search query
 */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q");
  if (!search)
    return NextResponse.json({ error: "invalid-query" }, { status: 400 });

  const searchQuery = search
    .trim()
    .split(" ")
    .map((word) => `${word}:*`)
    .join(" & ");

  const ads = await db.ad.findMany({
    orderBy: [
      {
        _relevance: {
          fields: ["title"],
          search: searchQuery,
          sort: "asc",
        },
      },
    ],
    where: {
      title: { search: searchQuery },
    },
    include: {
      category: {
        select: {
          name_ar: true,
          name_en: true,
        },
      },
    },
    take: 8,
  });

  const categorizedHits: {
    title: string;
    category: {
      categoryPath: string;
      name_ar: string;
      name_en: string;
    };
  }[] = [];
  const uncategorizedHits: string[] = [];
  const usedCategories = new Set<string>();

  const isQueryStrong =
    ads.length > 0 &&
    search.trim().length / ads[0]!.title.trim().split(" ")[0]!.length >= 0.8;

  for (const ad of ads) {
    const { categoryPath, category } = ad;
    if (!categoryPath || !isQueryStrong) {
      uncategorizedHits.push(ad.title);
      continue;
    }

    if (!usedCategories.has(categoryPath)) {
      categorizedHits.push({
        title: ad.title,
        category: {
          categoryPath,
          name_en: category?.name_en!,
          name_ar: category?.name_ar!,
        },
      });
      usedCategories.add(categoryPath);
    } else {
      uncategorizedHits.push(ad.title);
    }
  }

  return NextResponse.json({
    categorizedHits,
    uncategorizedHits,
  });
}
