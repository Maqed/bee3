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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [wasManuallyDismissed, setWasManuallyDismissed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRequestRef = useRef<string | null>(null);
  const isRequestInFlightRef = useRef(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (isRequestInFlightRef.current) {
        return;
      }

      if (lastRequestRef.current === debouncedSearchTerm) {
        return;
      }

      lastRequestRef.current = debouncedSearchTerm;
      isRequestInFlightRef.current = true;

      try {
        setLoading(true);
        setError(null);
        const data = await fetcher(debouncedSearchTerm);

        if (lastRequestRef.current === debouncedSearchTerm) {
          setOptions(data);
        }
      } catch (err) {
        if (lastRequestRef.current === debouncedSearchTerm) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch options",
          );
        }
      } finally {
        isRequestInFlightRef.current = false;
        if (lastRequestRef.current === debouncedSearchTerm) {
          setLoading(false);
        }
      }
    };

    if (
      debouncedSearchTerm === searchTerm &&
      searchTerm.length > 1 &&
      !wasManuallyDismissed
    ) {
      setIsResultVisible(true);
      fetchOptions();
    } else if (searchTerm.length === 0) {
      lastRequestRef.current = null;
      isRequestInFlightRef.current = false;
      setIsResultVisible(false);
      setOptions([]);
      setWasManuallyDismissed(false);
      setLoading(false);
      setError(null);
    }
  }, [fetcher, debouncedSearchTerm, searchTerm, wasManuallyDismissed]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultRef.current &&
        !resultRef.current.contains(event.target as Node) &&
        searchInputRef.current !== event.target
      ) {
        setIsResultVisible(false);
        setWasManuallyDismissed(true);
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
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Command
      className="relative w-full bg-transparent md:w-[300px] lg:w-[450px]"
      shouldFilter={false}
    >
      <CommandInput
        ref={searchInputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchTerm.length) onSubmit();
        }}
        className={cn(
          "flex items-center rounded-b-xl border border-b-0 bg-accent px-3 text-accent-foreground md:rounded-xl",
          { "rounded-b-none": isResultVisible },
        )}
        inputClassName="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
        disabled={disabled}
        value={searchTerm}
        onFocus={() => {
          if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
          }
          if (searchTerm.length > 0) {
            setIsResultVisible(true);
            setWasManuallyDismissed(false);
          }
        }}
        onBlur={() => {
          blurTimeoutRef.current = setTimeout(() => {
            setIsResultVisible(false);
            setWasManuallyDismissed(true);
          }, 10);
        }}
        onValueChange={(value) => {
          setSearchTerm(value);
          setWasManuallyDismissed(false);
        }}
      />
      <CommandList
        ref={resultRef}
        className={cn(
          "fixed top-11 w-full bg-accent shadow-xl md:top-16 md:w-[300px] lg:w-[450px]",
          isResultVisible ? "block" : "hidden",
          { "rounded-b-xl": isResultVisible },
        )}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onMouseUp={() => {
          searchInputRef.current?.focus();
        }}
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
        <CommandGroup className="p-0">
          {options.map((option) => (
            <CommandItem
              key={getOptionValue(option)}
              value={getOptionValue(option)}
              onSelect={() => {
                if (blurTimeoutRef.current) {
                  clearTimeout(blurTimeoutRef.current);
                  blurTimeoutRef.current = null;
                }
                onSearch(option);
                setIsResultVisible(false);
                setWasManuallyDismissed(true);
              }}
              className="group min-h-11 rounded-none px-2 py-3 data-[selected='true']:bg-primary"
            >
              <Search className="me-2 size-4 shrink-0 opacity-50 group-data-[selected='true']:text-primary-foreground" />
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
