export type LocationType = "governorate" | "city";
export type Location = {
  id: number;
  type: LocationType;
  governorate?: number;
  nameAr: string;
  nameEn: string;
};
