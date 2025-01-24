import { Tablet, Refrigerator, CarFront } from "lucide-react";
import type { ReactNode } from "react";

type categoryIconsType = Record<string, ReactNode>;

export const categoryIcons: categoryIconsType = {
  "mobiles-and-tablets": <Tablet />,
  electronics: <Refrigerator />,
  vehicles: <CarFront />,
};
