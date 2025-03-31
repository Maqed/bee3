import { Tablet, Refrigerator, CarFront, LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type CategoryIconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;
type CategoryIconsType = Record<string, CategoryIconType>;

export const categoryIcons: CategoryIconsType = {
  "mobiles-and-tablets": Tablet,
  electronics: Refrigerator,
  vehicles: CarFront,
};
