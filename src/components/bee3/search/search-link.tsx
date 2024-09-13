"use client";
import { getCategoryAndSubCategory } from "@/lib/utils";
import {
  getClientSideCategory,
  getClientSideSubCategory,
} from "@/lib/client-side";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

type Props = {
  title?: string;
  categoryPath: string;
  linkType: "ad" | "category";
  onClick?: () => void;
};
function SearchLink({ title, categoryPath, linkType, onClick }: Props) {
  const tSearch = useTranslations("search");
  const { category, subCategory } = getCategoryAndSubCategory(categoryPath);

  let intlCategory = getClientSideCategory(category);
  if (subCategory) {
    intlCategory = getClientSideSubCategory(category, subCategory);
  }

  return (
    <Link
      className="search-link w-full border-b px-3 py-2 transition last-of-type:border-none hover:bg-muted"
      href={`/${categoryPath}${title ? `?q=${title}` : ""}`}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {linkType === "ad" ? (
        <>
          {title}{" "}
          <span className="text-foreground/70">
            {tSearch("in")} {intlCategory}
          </span>
        </>
      ) : (
        intlCategory
      )}
    </Link>
  );
}

export default SearchLink;
