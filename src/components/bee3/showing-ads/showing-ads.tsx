import { absoluteURL } from "@/lib/utils";
import { Ad } from "@/types/bee3";
import { notFound } from "next/navigation";
import React from "react";
import AdCard from "../ad-card";
import ShowingAdsNotFound from "./showing-ads-not-found";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { DEFAULT_PAGE_SIZE } from "@/consts/ad-search";

async function ShowingAds({ params }: { params: URLSearchParams }) {
  const searchResponse = await fetch(
    absoluteURL(`/api/bee3/search?${params.toString()}`),
    {
      method: "GET",
    },
  );

  if (searchResponse.status !== 200) {
    notFound();
  }

  const { ads, totalPages }: { ads: Ad[]; totalPages: number } =
    await searchResponse.json();
  return (
    <>
      {ads.length ? (
        ads.map((ad) => {
          return <AdCard key={ad.id} orientation="horizontal" ad={ad} />;
        })
      ) : (
        <ShowingAdsNotFound />
      )}
      <PaginationWithLinks
        totalPageCount={totalPages}
        page={Number(params.get("page")) ?? 1}
        pageSize={DEFAULT_PAGE_SIZE}
      />
    </>
  );
}

export default ShowingAds;
