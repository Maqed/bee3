"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { governorates } from "@/schema/governorates";
import type { Location, LocationType } from "@/types/locations";
import { cities } from "@/schema/cities";

type LocationComboboxProps = {
  initialGovernorate: number;
  initialCity: number;
  showAllGovernorates?: boolean;
  hasAll?: boolean;
  showAllCities?: boolean;
  showCitiesOfGovernorate?: number | null;
  onLocationChange: (governorate: number, city: number) => void;
  className?: string;
};

const LocationCombobox = ({
  initialGovernorate,
  initialCity,
  hasAll = true,
  showAllGovernorates = true,
  showAllCities = true,
  showCitiesOfGovernorate = null,
  onLocationChange,
  className,
}: LocationComboboxProps) => {
  const locale = useLocale();
  const t = useTranslations("location-combobox");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>(0);

  const [governorate, setGovernorate] = useState<number>(initialGovernorate);
  const [city, setCity] = useState<number>(initialCity);
  const locations: Location[] = useMemo(() => {
    const result: Location[] = [];

    if (hasAll) {
      result.push({
        id: 0,
        type: "governorate" as LocationType,
        nameAr: "الكل",
        nameEn: "All",
      });
    }

    if (showAllGovernorates) {
      governorates.forEach((gov) => {
        result.push({
          id: gov.id,
          type: "governorate" as LocationType,
          nameAr: gov.governorate_name_ar,
          nameEn: gov.governorate_name_en,
        });
      });
    }

    if (showCitiesOfGovernorate) {
      const filteredCities = cities.filter(
        (city) => city.governorate_id === showCitiesOfGovernorate,
      );

      filteredCities.forEach((city) => {
        result.push({
          id: city.id,
          type: "city" as LocationType,
          nameAr: city.city_name_ar,
          nameEn: city.city_name_en,
          governorate: city.governorate_id,
        });
      });
    } else if (showAllCities) {
      cities.forEach((city) => {
        result.push({
          id: city.id,
          type: "city" as LocationType,
          nameAr: city.city_name_ar,
          nameEn: city.city_name_en,
          governorate: city.governorate_id,
        });
      });
    }

    return result;
  }, [showAllGovernorates, showAllCities, showCitiesOfGovernorate, hasAll]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setGovernorate(initialGovernorate);
    setCity(initialCity);
  }, [initialGovernorate, initialCity]);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLocationName = (location: Location) => {
    return locale === "ar" ? location.nameAr : location.nameEn;
  };

  const getSelectedLocationName = () => {
    if (city > 0) {
      const selectedCity = locations.find(
        (loc) => loc.type === "city" && loc.id === city,
      );
      return selectedCity ? getLocationName(selectedCity) : t("select");
    } else if (governorate > 0) {
      const selectedGov = locations.find(
        (loc) => loc.type === "governorate" && loc.id === governorate,
      );
      return selectedGov ? getLocationName(selectedGov) : t("select");
    }
    return t("select");
  };

  const handleLocationSelect = (locationValue: string) => {
    const parts = locationValue.split("-");
    if (parts.length < 2) return;

    const type = parts[0];
    const numId = parseInt(parts[1] || "0");

    if (type === "governorate") {
      setGovernorate(numId);
      setCity(0);
      onLocationChange(numId, 0);
    } else if (type === "city") {
      const selectedCity = locations.find(
        (loc) => loc.type === "city" && loc.id === numId,
      );

      if (selectedCity && selectedCity.governorate) {
        setGovernorate(selectedCity.governorate);
        setCity(numId);
        onLocationChange(selectedCity.governorate, numId);
      } else {
        setCity(numId);
        onLocationChange(governorate, numId);
      }
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          id="location"
        >
          {getSelectedLocationName()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: `${triggerWidth}px` }}
      >
        <Command className="w-full">
          <CommandInput placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("notFound")}</CommandEmpty>
            {showAllGovernorates && (
              <CommandGroup heading={t("governorates")}>
                {locations
                  .filter((loc) => loc.type === "governorate")
                  .map((location) => (
                    <CommandItem
                      key={`gov-${location.id}`}
                      value={`governorate-${location.id}-${location.nameAr}-${location.nameEn}`}
                      onSelect={handleLocationSelect}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          governorate === location.id && city === 0
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {getLocationName(location)}
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
            {(showAllCities || showCitiesOfGovernorate) && (
              <CommandGroup heading={t("cities")}>
                {locations
                  .filter((loc) => loc.type === "city")
                  .map((location) => {
                    return (
                      <CommandItem
                        key={`city-${location.id}`}
                        value={`city-${location.id}-${location.nameAr}-${location.nameEn}`}
                        onSelect={handleLocationSelect}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            city === location.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {getLocationName(location)}
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationCombobox;
