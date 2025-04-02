"use client";
import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
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
import { Search } from "lucide-react";

export interface AsyncSearchProps<T> {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** When user searches an item **/
  onSearch: (option: T) => void;
  onSubmit: () => void;
  /**SearchTerm value */
  searchTerm: string;
  /**Setter for searchTerm */
  setSearchTerm: Dispatch<SetStateAction<string>>;
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
  onSubmit,
  searchTerm,
  setSearchTerm,
  notFound,
  loadingSkeleton,
  placeholder,
  disabled,
  noResultsMessage,
}: AsyncSearchProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
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

    if (debouncedSearchTerm === searchTerm && searchTerm.length > 0) {
      setIsResultVisible(true);
      fetchOptions();
    } else {
      setIsResultVisible(false);
      setOptions([]);
    }
  }, [fetcher, debouncedSearchTerm, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultRef.current &&
        !resultRef.current.contains(event.target as Node) &&
        searchInputRef.current !== event.target
      ) {
        setIsResultVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isActive = document.activeElement === searchInputRef.current;
      if (!isActive && e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Command
      className="relative w-[250px] md:w-[300px] lg:w-[450px]"
      shouldFilter={false}
    >
      <CommandInput
        ref={searchInputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchTerm.length) onSubmit();
        }}
        className={cn({ "rounded-b-none": isResultVisible })}
        placeholder={placeholder}
        disabled={disabled}
        value={searchTerm}
        onFocus={() => {
          if (searchTerm.length > 0) setIsResultVisible(true);
        }}
        onValueChange={(value) => {
          if (value.length > 0) {
            setIsResultVisible(true);
          } else {
            setIsResultVisible(false);
            setOptions([]);
          }
          setSearchTerm(value);
        }}
      />
      <CommandList
        ref={resultRef}
        className={cn(
          "fixed top-16 max-h-full w-[250px] bg-background shadow-xl md:w-[300px] lg:w-[450px]",
          isResultVisible ? "block" : "hidden",
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
                setIsResultVisible(false);
              }}
              className="h-11 px-2 py-3"
            >
              <Search className="me-2 size-4 shrink-0 opacity-50" />
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
      {[...Array(8)].map((_, index) => (
        <CommandItem key={`async-search-default-loading-skeleton-${index}`}>
          <Skeleton className="h-11 w-full px-2 py-3" />
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
