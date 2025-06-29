import { type Ad } from "./bee3";

export type AdWithUser = Ad & {
  user: { id: string; name: string; createdAt: Date; contactMethod?: string };
  attributeValues?: {
    id: string;
    value: string;
    attribute: {
      id: string;
      name: string;
      type: string;
      unit: string | null;
    };
  }[];
};
