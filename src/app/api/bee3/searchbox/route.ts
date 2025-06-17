import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q");
  if (!search)
    return NextResponse.json({ error: "invalid-query" }, { status: 400 });

  const similarityThreshold = 0.25;
  const searchTerm = search.trim();
  const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);

  if (searchWords.length === 0) {
    return NextResponse.json({
      categorizedHits: [],
      uncategorizedHits: [],
    });
  }

  const wordConditions = searchWords
    .map((_, index) => `word_similarity($${index + 1}, "Ad".title) > ${similarityThreshold}`)
    .join(' OR ');

  const likeConditions = searchWords
    .map((_, index) => `"Ad".title ILIKE $${searchWords.length + index + 1}`)
    .join(' OR ');

  const params = [
    ...searchWords,                           // For word_similarity
    ...searchWords.map(word => `%${word}%`),  // For ILIKE
  ];

  const ads = await db.$queryRawUnsafe(`
    SELECT 
      "Ad".id,
      "Ad".title,
      "Ad"."categoryPath",
      -- 2. USE MAX WORD_SIMILARITY FOR SCORING
      GREATEST(${searchWords
      .map((_, i) => `word_similarity($${i + 1}, "Ad".title)`)
      .join(', ')}) AS similarity_score,
      "Category"."name_ar",
      "Category"."name_en"
    FROM "Ad"
    LEFT JOIN "Category" ON "Ad"."categoryPath" = "Category".path
    WHERE (${wordConditions}) OR (${likeConditions})
    ORDER BY similarity_score DESC
    LIMIT 8
  `,
    ...params
  ) as Array<{
    id: number;
    title: string;
    categoryPath: string | null;
    similarity_score: number;
    name_ar: string | null;
    name_en: string | null;
  }>;

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

  const isQueryStrong = ads.length > 0 && ads[0]!.similarity_score >= 0.5;

  for (const ad of ads) {
    const { categoryPath, name_ar, name_en } = ad;

    if (!categoryPath || !isQueryStrong) {
      uncategorizedHits.push(ad.title);
      continue;
    }

    if (!usedCategories.has(categoryPath)) {
      categorizedHits.push({
        title: ad.title,
        category: {
          categoryPath,
          name_en: name_en!,
          name_ar: name_ar!,
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