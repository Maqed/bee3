import React from "react";
import { getTranslations } from "next-intl/server";
import { getCategoryTranslations } from "@/lib/category-asynchronous";
import { getLocalizedPrice } from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";
import AdPageUI from "@/components/bee3/ad-page/ad-page-ui";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/server/db";

async function fetchAdData(adId: string): Promise<AdWithUser | null> {
  try {
    let ad = await db.ad.findUnique({
      where: { id: adId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            contactMethod: true,
            banned: true,
            role: true,
          },
        },
        images: true,
        attributeValues: {
          include: {
            attribute: {
              select: {
                id: true,
                name: true,
                type: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    const session = await getServerAuthSession();
    if (
      !ad ||
      !ad.user ||
      ((ad.deletedAt !== null || ad.user.banned) &&
        (!session || session.user.role !== "admin"))
    ) {
      return null;
    }

    if (ad.adStatus === "ACCEPTED") {
      return ad as AdWithUser;
    }

    if (!session) {
      return null;
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = session.user.id === ad.userId;

    if (ad.adStatus === "REJECTED" || ad.adStatus === "PENDING") {
      if (!isAdmin && !isOwner) {
        return null;
      }
    }

    return ad as AdWithUser;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; adId: string };
}): Promise<Metadata> {
  const ad = await fetchAdData(params.adId);

  if (!ad) {
    const tAd = await getTranslations("/ad/[adId].metadata");
    return { title: tAd("ad-not-found") };
  }
  const { getRecursiveCategoryName } = await getCategoryTranslations();
  let localizedCategory = await getRecursiveCategoryName(ad.categoryPath);

  const localizedPrice = getLocalizedPrice(params.locale, ad.price);

  const title = `${ad.title} - ${localizedCategory} - ${localizedPrice}`;
  const description = ad.description;
  const images = ad.images;

  return {
    title,
    description,
    openGraph: {
      title,
      description: description ?? undefined,
      images,
    },
    twitter: {
      title,
      description: description ?? undefined,
      images,
    },
  };
}

export default async function AdPage({ params }: { params: { adId: string } }) {
  const ad = await fetchAdData(params.adId);
  const session = await getServerAuthSession();

  if (!ad) {
    notFound();
  }

  return <AdPageUI ad={ad} session={session} />;
}
