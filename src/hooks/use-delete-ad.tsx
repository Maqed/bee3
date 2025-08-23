import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adId: string) => {
      const response = await fetch(`/api/bee3/ad/${adId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ad");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all my-ads queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["my-ads"],
      });
    },
  });
}
