import ShowingAdsLayout from "@/components/bee3/showing-ads/showing-ads-layout";
import React, { ReactNode } from "react";

function AdsLayout({ children }: { children: ReactNode }) {
  return <ShowingAdsLayout>{children}</ShowingAdsLayout>;
}

export default AdsLayout;
