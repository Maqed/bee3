import { Location, LocationType } from "@/types/locations";
import { governorates } from "@/schema/governorates";
import { cities } from "@/schema/cities";

export const locations: Location[] = [
  {
    id: 0,
    type: "governorate",
    nameAr: "الكل",
    nameEn: "All",
  },
  ...governorates.map((gov) => ({
    id: gov.id,
    type: "governorate" as LocationType,
    nameAr: gov.governorate_name_ar,
    nameEn: gov.governorate_name_en,
  })),
  ...cities.map((city) => ({
    id: city.id,
    type: "city" as LocationType,
    governorate: city.governorate_id,
    nameAr: city.city_name_ar,
    nameEn: city.city_name_en,
  })),
];
