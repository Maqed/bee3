import { LaptopMinimal, Refrigerator } from "lucide-react";
import type { ReactNode } from "react";

type categoryIconsType = Record<string, ReactNode>;

export const categoryIcons: categoryIconsType = {
  "mobiles-and-tablets": <LaptopMinimal />,
  electronics: <Refrigerator />,
};
