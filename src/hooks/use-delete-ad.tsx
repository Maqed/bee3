import { useRouter } from "@/i18n/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAd() {
  const queryClient = useQueryClient();
  const router = useRouter();

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
      router.refresh();
      router.push("/my-ads");
      queryClient.invalidateQueries({
        queryKey: ["my-ads"],
      });
    },
  });
}
