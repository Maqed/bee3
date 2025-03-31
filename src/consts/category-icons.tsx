import {
  Tablet,
  CarFront,
  LucideProps,
  Car,
  Fuel,
  Smartphone,
  Disc,
  TabletSmartphone,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type CategoryIconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;
type CategoryIconsType = Record<
  string,
  { icon: CategoryIconType; subCategories: Record<string, CategoryIconType> }
>;

export const categoryIcons: CategoryIconsType = {
  vehicles: {
    icon: CarFront,
    subCategories: { "gas-cars": Fuel, "electric-cars": Car },
  },
  "mobiles-and-tablets": {
    icon: TabletSmartphone,
    subCategories: {
      "mobile-phones": Smartphone,
      tablets: Tablet,
      accessories: Disc,
    },
  },
};
