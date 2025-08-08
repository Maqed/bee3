"use client";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaSearch as Search } from "react-icons/fa";
import { useTranslations } from "next-intl";

function AdSearchbox() {
  const [query, setQuery] = useState("");
  const t = useTranslations("ad-searchbox");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/ads?q=${query}`);
      }}
      className="relative"
    >
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder={t("placeholder")}
        className="pe-11"
      />
      <Button
        className="absolute end-0 top-0 rounded-none rounded-e-md"
        size="icon"
        type="submit"
      >
        <Search />
      </Button>
    </form>
  );
}

export default AdSearchbox;
