"use client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useRouter } from "@/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useFavoriteAds } from "@/hooks/useFavAds";
import { useEffect, useState } from "react";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/consts/routes";
import { getQueryClient } from "@/providers/get-query-client";

type Props = {
  adId: string;
  className?: string;
};

function FavoritesHeart({ adId, className }: Props) {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const router = useRouter();
  const queryClient = getQueryClient();
  const tFavoritesHeart = useTranslations("favorites-heart");
  const { data: favoriteAdsData, isFetching: isFavoritesFetching } =
    useFavoriteAds();

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (favoriteAdsData?.favoriteAds) {
      const isAdFavorited = favoriteAdsData.favoriteAds.some(
        (favAd) => favAd.id === adId,
      );
      setIsFavorited(isAdFavorited);
    } else if (!session) {
      setIsFavorited(false);
    }
  }, [favoriteAdsData, adId, session]);

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
      queryClient.invalidateQueries({
        queryKey: ["favorite-ads"],
        refetchType: "inactive",
      });
    },
  });

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session && !isSessionPending) return;

    if (!session) {
      router.push(DEFAULT_UNAUTHENTICATED_REDIRECT);
      return;
    }

    if (mutation.isPending) return; // Prevent multiple clicks while loading
    mutation.mutate();
  };

  return (
    <button onClick={handleHeartClick}>
      <Heart
        fill={isFavorited ? "currentColor" : "none"}
        className={cn(
          "size-5 cursor-pointer transition-all",
          isFavorited && !isFavoritesFetching
            ? "text-red-600 hover:text-red-700"
            : "text-foreground/70 hover:fill-red-500 hover:text-red-600",
          (mutation.isPending || isFavoritesFetching) && "animate-pulse",
          className,
        )}
        aria-label={
          isFavorited
            ? tFavoritesHeart("aria-label.remove-from-favorites")
            : tFavoritesHeart("aria-label.add-to-favorites")
        }
      />
    </button>
  );
}

export default FavoritesHeart;
