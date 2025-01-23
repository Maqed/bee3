"use client";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useRouter } from "@/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFavoriteAds } from "@/hooks/useFavAds";
import { useEffect, useState } from "react";

type Props = {
  adId: string;
  className?: string;
};

function FavoritesHeart({ adId, className }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: favoriteAdsData, isLoading: isFavoritesLoading } =
    useFavoriteAds();

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (favoriteAdsData?.favoriteAds) {
      const isAdFavorited = favoriteAdsData.favoriteAds.some(
        (favAd) => favAd.id === adId,
      );
      setIsFavorited(isAdFavorited);
    }
  }, [favoriteAdsData, adId]);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/bee3/favAd", {
        method: "POST",
        body: JSON.stringify({
          adId,
          state: isFavorited,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update favorite status");
      }

      return response.json();
    },
    onMutate: async () => {
      setIsFavorited((prev) => !prev);
    },
    onError: (error) => {
      setIsFavorited((prev) => !prev);
      console.error("Error updating favorite status:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-ads"] });
    },
  });

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/register");
      return;
    }

    if (mutation.isPending) return; // Prevent multiple clicks while loading
    mutation.mutate();
  };

  return (
    <Heart
      onClick={handleHeartClick}
      fill={isFavorited ? "currentColor" : "none"}
      className={cn(
        "size-5 cursor-pointer transition-all",
        isFavorited
          ? "text-red-600 hover:text-red-700"
          : "text-foreground/70 hover:fill-red-500 hover:text-red-600",
        (mutation.isPending || isFavoritesLoading) && "animate-pulse",
        className,
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    />
  );
}

export default FavoritesHeart;
