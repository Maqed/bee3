// Admin-related constants

// Define allowed rejection reasons for ad rejection
export const ALLOWED_REJECTION_REASONS = [
  "repeated-ad",
  "inappropriate-ad",
] as const;

export type RejectionReason = (typeof ALLOWED_REJECTION_REASONS)[number];
