import { useTranslations } from "next-intl";
import type { AdWithUser } from "@/types/ad-page-types";
import { Alert } from "@/components/ui/alert";

interface AdStatusIndicatorProps {
  ad: AdWithUser;
}

export default function AdStatusIndicator({ ad }: AdStatusIndicatorProps) {
  const t = useTranslations("/ad/[adId]");

  if (ad.adStatus === "PENDING") {
    return <Alert variant="warning" message={t("status.pending")} />;
  }

  if (ad.adStatus === "REJECTED") {
    // Try to get internationalized rejection reason
    const getRejectionReason = () => {
      if (!ad.rejectedFor) return null;

      // Check if it's a known rejection reason key
      const rejectionReasonKey = `status.reject-reasons.${ad.rejectedFor}`;
      try {
        const translatedReason = t(rejectionReasonKey);
        // If translation exists and is not the same as the key, use it
        if (translatedReason !== rejectionReasonKey) {
          return translatedReason;
        }
      } catch (error) {
        // Translation doesn't exist, fall back to original
      }

      // Fall back to the original rejection reason
      return ad.rejectedFor;
    };

    const rejectionReason = getRejectionReason();

    return (
      <Alert
        variant="destructive"
        message={t("status.rejected")}
        description={rejectionReason || undefined}
      />
    );
  }

  return null;
}
