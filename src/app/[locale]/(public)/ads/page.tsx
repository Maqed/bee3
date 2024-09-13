import ShowingAdsPage from "@/components/bee3/showing-ads-page";
import React from "react";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

function AdsPage({ searchParams }: Props) {
  return <ShowingAdsPage searchParams={searchParams} />;
}

export default AdsPage;
