"use client";
import React from "react";
import { Ad } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { absoluteURL, cn } from "@/lib/utils";
import SearchLink from "./search-link";
import { useRouter } from "next/navigation";

const MAX_SEARCH_ADS = 3;
// TODO: Integrate it with real data
function AdSearch() {
  const [query, setQuery] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [areSearchedAdsVisible, setAreSearchedAdsVisible] = useState(false);
  const tSearch = useTranslations("search");
  const searchedAdsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchSearchAds() {
      const response = await fetch(
        absoluteURL(`/api/bee3/search?q=${query}&pageSize=${MAX_SEARCH_ADS}`),
        { method: "GET" },
      );
      const { ads } = await response.json();
      setAds(ads);
      console.log("#".repeat(20));
      console.log({ query, ads });
      console.log("#".repeat(20));
    }
    if (query) {
      fetchSearchAds();
    } else {
      setAds([]);
    }
  }, [query]);

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

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query) router.push(`/ads?q=${query}`);
  }

  return (
    <form onSubmit={handleOnSubmit} className="group relative">
      <div className="flex">
        <Input
          ref={searchInputRef}
          className={cn(
            "w-64 rounded-e-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:w-96 lg:w-[400px]",
            areSearchedAdsVisible && "rounded-b-none",
          )}
          placeholder={tSearch("placeholder")}
          onFocus={() => setAreSearchedAdsVisible(true)}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        <Button
          type="submit"
          className={cn(
            "rounded-s-none",
            areSearchedAdsVisible && "rounded-b-none",
          )}
          size="icon"
        >
          <Search />
        </Button>
      </div>
      <div
        ref={searchedAdsRef}
        className={cn(
          "absolute z-50 flex max-h-96 w-full flex-col overflow-auto rounded-b-md border bg-popover transition",
          areSearchedAdsVisible
            ? "opacity-1 scale-100"
            : "invisible scale-95 opacity-0",
        )}
      >
        <SearchLink
          title={"IPhone 11"}
          categoryPath={"mobiles-and-tablets/mobile-phones"}
          linkType="ad"
          onClick={() => {
            setAreSearchedAdsVisible(false);
          }}
        />
        <SearchLink
          title={"IPhone 12"}
          categoryPath={"mobiles-and-tablets/mobile-phones"}
          linkType="ad"
          onClick={() => {
            setAreSearchedAdsVisible(false);
          }}
        />
        <SearchLink
          title={"IPhone 13"}
          categoryPath={"mobiles-and-tablets/mobile-phones"}
          linkType="ad"
          onClick={() => {
            setAreSearchedAdsVisible(false);
          }}
        />
        <SearchLink
          title={"IPhone 13"}
          categoryPath={"mobiles-and-tablets/mobile-phones"}
          linkType="ad"
          onClick={() => {
            setAreSearchedAdsVisible(false);
          }}
        />
        <SearchLink
          categoryPath={"mobiles-and-tablets/mobile-phones"}
          linkType="category"
          onClick={() => {
            setAreSearchedAdsVisible(false);
          }}
        />
      </div>
    </form>
  );
}

export default AdSearch;
