import { Tablet, Refrigerator, CarFront, LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type CategoryIconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;
type CategoryIconsType = Record<string, { icon: CategoryIconType }>;

export const categoryIcons: CategoryIconsType = {
  "mobiles-and-tablets": {
    icon: Tablet,
  },
  electronics: { icon: Refrigerator },
  vehicles: { icon: CarFront },
};
