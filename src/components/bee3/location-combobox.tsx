"use client";
import { useEffect, useState } from "react";
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
import type { Location } from "@/types/locations";
import { locations } from "@/consts/locations";

type LocationComboboxProps = {
  initialGovernorate: number;
  initialCity: number;
  showGovernorates?: boolean;
  showCities?: boolean;
  onLocationChange: (governorate: number, city: number) => void;
  className?: string;
};

const LocationCombobox = ({
  initialGovernorate,
  initialCity,
  showGovernorates = true,
  showCities = true,
  onLocationChange,
}: LocationComboboxProps) => {
  const locale = useLocale();
  const t = useTranslations("location-combobox");

  const [governorate, setGovernorate] = useState<number>(initialGovernorate);
  const [city, setCity] = useState<number>(initialCity);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setGovernorate(initialGovernorate);
    setCity(initialCity);
  }, [initialGovernorate, initialCity]);

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
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          id="location"
        >
          {getSelectedLocationName()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("notFound")}</CommandEmpty>
            {showGovernorates && (
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
            {showCities && (
              <CommandGroup heading={t("cities")}>
                {locations
                  .filter((loc) => loc.type === "city")
                  .map((location) => {
                    const parentGov = governorates.find(
                      (gov) => gov.id === location.governorate,
                    );
                    const parentName = parentGov
                      ? locale === "ar"
                        ? parentGov.governorate_name_ar
                        : parentGov.governorate_name_en
                      : "";

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
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({parentName})
                        </span>
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
