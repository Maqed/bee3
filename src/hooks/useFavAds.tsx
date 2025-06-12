"use client";
import { useQuery } from "@tanstack/react-query";
import { type Ad } from "@/types/bee3";
import { authClient } from "@/lib/auth-client";

interface FavoriteAdsResponse {
  favoriteAds: Ad[];
}

export function useFavoriteAds() {
  const { data: session } = authClient.useSession();

  return useQuery<FavoriteAdsResponse, Error>({
    queryKey: ["favorite-ads", session?.user.id],
    queryFn: async () => {
      const response = await fetch("/api/bee3/favAds");

      if (!response.ok) {
        throw new Error("Failed to fetch favorite ads");
      }

      return response.json();
    },
    enabled: !!session?.user.id, // Only fetch when user is logged in
    staleTime: Infinity,
  });
}
