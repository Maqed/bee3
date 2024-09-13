"use client";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { absoluteURL } from "@/lib/utils";

const MAX_SEARCH_ADS = 5;

function AdSearch() {
  const [query, setQuery] = useState("");
  const [ads, setAds] = useState([]);
  const tSearch = useTranslations("search");
  useEffect(() => {
    async function fetchSearchAds() {
      const ads = await fetch(
        absoluteURL(`/api/bee3/search?q=${query}&pageSize=${MAX_SEARCH_ADS}`),
        { method: "GET" },
      );
      //   setAds(ads);
      //   console.log(ads);
    }
    fetchSearchAds();
  }, [query]);
  return (
    <form className="flex">
      <Input
        className="w-64 rounded-e-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 md:w-96 lg:w-[400px]"
        placeholder={tSearch("placeholder")}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" className="rounded-s-none" size="icon">
        <Search />
      </Button>
    </form>
  );
}

export default AdSearch;
