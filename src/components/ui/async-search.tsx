import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@uidotdev/usehooks";
import { Skeleton } from "./skeleton";

export interface AsyncSearchProps<T> {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** When user searches an item **/
  onSearch: (option: T) => void;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Placeholder text */
  placeholder?: string;
  /** Disable the entire search */
  disabled?: boolean;
  /** Custom no results message */
  noResultsMessage?: string;
}

export function AsyncSearch<T>({
  fetcher,
  renderOption,
  getOptionValue,
  onSearch,
  notFound,
  loadingSkeleton,
  placeholder,
  disabled,
  noResultsMessage,
}: AsyncSearchProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [areSearchedAdsVisible, setAreSearchedAdsVisible] = useState(false);
  const searchedAdsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetcher(debouncedSearchTerm);
        setOptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch options",
        );
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearchTerm) {
      fetchOptions();
    } else {
      setOptions([]);
    }
  }, [fetcher, debouncedSearchTerm]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchedAdsRef.current &&
        !searchedAdsRef.current.contains(event.target as Node) &&
        searchInputRef.current !== event.target
      ) {
        setAreSearchedAdsVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <Command className="w-[450px]" shouldFilter={false}>
      <div className="relative w-full border-b">
        <CommandInput
          placeholder={placeholder}
          disabled={disabled}
          value={searchTerm}
          onFocus={() => setAreSearchedAdsVisible(true)}
          onValueChange={(value) => {
            if (value.length > 0) {
              setAreSearchedAdsVisible(true);
            } else {
              setAreSearchedAdsVisible(false);
              setOptions([]);
            }
            setSearchTerm(value);
          }}
        />
        {loading && (
          <div className="absolute end-2 top-1/2 flex -translate-y-1/2 transform items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <CommandList
        ref={searchedAdsRef}
        className={cn(
          "fixed top-28 w-[450px] bg-background shadow-xl",
          areSearchedAdsVisible ? "block" : "hidden",
        )}
      >
        {error && (
          <div className="p-4 text-center text-destructive">{error}</div>
        )}
        {loading &&
          options.length === 0 &&
          (loadingSkeleton || <DefaultLoadingSkeleton />)}
        {!loading &&
          !error &&
          debouncedSearchTerm.length > 0 &&
          options.length === 0 &&
          (notFound || <CommandEmpty>{noResultsMessage}</CommandEmpty>)}
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={getOptionValue(option)}
              value={getOptionValue(option)}
              onSelect={() => {
                onSearch(option);
                setAreSearchedAdsVisible(false);
              }}
            >
              {renderOption(option)}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[...Array(6)].map((_) => (
        <CommandItem>
          <Skeleton className="h-8 w-full" />
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
