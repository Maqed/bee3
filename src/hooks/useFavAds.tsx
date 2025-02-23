"use client";
import { useQuery } from "@tanstack/react-query";
import { type Ad } from "@/types/bee3";

interface FavoriteAdsResponse {
  favoriteAds: Ad[];
}

export function useFavoriteAds() {
  return useQuery<FavoriteAdsResponse, Error>({
    queryKey: ["favorite-ads"],
    queryFn: async () => {
      const response = await fetch("/api/bee3/favAds");

      if (!response.ok) {
        throw new Error("Failed to fetch favorite ads");
      }

      return response.json();
    },
    staleTime: Infinity,
  });
}
