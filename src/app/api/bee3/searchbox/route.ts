import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q");
  if (!search)
    return NextResponse.json({ error: "invalid-query" }, { status: 400 });

  const searchTerm = search.trim();
  if (searchTerm.length === 0) {
    return NextResponse.json({
      categorizedHits: [],
      uncategorizedHits: [],
    });
  }

  // Limit search term length to prevent complex queries
  const limitedSearchTerm = searchTerm.slice(0, 50);

  try {
    // Use a much simpler and faster query approach
    // First try exact/prefix matches (fastest)
    const exactMatches = await db.ad.findMany({
      where: {
        title: {
          contains: limitedSearchTerm,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        title: true,
        categoryPath: true,
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });

    // If we have enough exact matches, use those
    if (exactMatches.length >= 4) {
      const categorizedHits: {
        title: string;
        category: {
          categoryPath: string;
        };
      }[] = [];
      const uncategorizedHits: string[] = [];
      const usedCategories = new Set<string>();

      for (const ad of exactMatches) {
        const { categoryPath } = ad;

        if (!categoryPath) {
          uncategorizedHits.push(ad.title);
          continue;
        }

        if (!usedCategories.has(categoryPath)) {
          categorizedHits.push({
            title: ad.title,
            category: {
              categoryPath,
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

    // Fallback to word similarity only if needed, with simpler query
    const searchWords = limitedSearchTerm
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .slice(0, 3);

    if (searchWords.length === 0) {
      return NextResponse.json({
        categorizedHits: [],
        uncategorizedHits: [],
      });
    }

    // Much simpler similarity query - just use the first word for similarity
    const primaryWord = searchWords[0];
    const similarityThreshold = 0.3;

    const ads = (await db.$queryRaw`
      SELECT 
        "Ad".id,
        "Ad".title,
        "Ad"."categoryPath",
        word_similarity(${primaryWord}, "Ad".title) AS similarity_score
      FROM "Ad"
      WHERE word_similarity(${primaryWord}, "Ad".title) > ${similarityThreshold}
         OR "Ad".title ILIKE ${`%${primaryWord}%`}
      ORDER BY similarity_score DESC
      LIMIT 8
    `) as Array<{
      id: number;
      title: string;
      categoryPath: string | null;
      similarity_score: number;
    }>;

    const categorizedHits: {
      title: string;
      category: {
        categoryPath: string;
      };
    }[] = [];
    const uncategorizedHits: string[] = [];
    const usedCategories = new Set<string>();

    const isQueryStrong = ads.length > 0 && ads[0]!.similarity_score >= 0.5;

    for (const ad of ads) {
      const { categoryPath } = ad;

      if (!categoryPath || !isQueryStrong) {
        uncategorizedHits.push(ad.title);
        continue;
      }

      if (!usedCategories.has(categoryPath)) {
        categorizedHits.push({
          title: ad.title,
          category: {
            categoryPath,
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
  } catch (error) {
    console.error("Search error:", error);
    // Return empty results instead of error to prevent abort
    return NextResponse.json({
      categorizedHits: [],
      uncategorizedHits: [],
    });
  }
}
