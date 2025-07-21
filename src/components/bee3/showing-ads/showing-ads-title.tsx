"use client";
import { useCategoryTranslations } from "@/lib/category-synchronous";
import { useSearchParams } from "next/navigation";
import React from "react";

function ShowingAdsTitle({ categoryPath }: { categoryPath?: string[] }) {
  const searchParams = useSearchParams();
  const { getRecursiveCategoryName } = useCategoryTranslations();

  const categoryName = categoryPath
    ? getRecursiveCategoryName(categoryPath)
    : "";
  const searchQuery = searchParams.get("q") || "";

  let title = "";
  if (categoryName && searchQuery) {
    title = `${categoryName} - ${searchQuery}`;
  } else if (categoryName) {
    title = categoryName;
  } else if (searchQuery) {
    title = searchQuery;
  }

  return title ? (
    <h1 className="mb-5 text-2xl font-bold lg:text-3xl">{title}</h1>
  ) : null;
}

export default ShowingAdsTitle;
