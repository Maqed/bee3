import ShowingAdsPage from "@/components/bee3/showing-ads/showing-ads-page";
import {
  getServerSideCategory,
  getServerSideSubCategory,
} from "@/lib/server-side";
import { getCategoryAndSubCategory } from "@/lib/category";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { categoryPath: string[] };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: Props) {
  const { category, subCategory } = getCategoryAndSubCategory(
    params.categoryPath,
  );

  const localizedCategory = subCategory
    ? await getServerSideSubCategory(category, subCategory)
    : await getServerSideCategory(category);

  const t = await getTranslations("/[categoryPath].metadata");

  return {
    title: localizedCategory,
    description: t("description", { category: localizedCategory }),
  };
}

function CategoryPathPage({ params, searchParams }: Props) {
  return (
    <ShowingAdsPage
      categoryPath={params.categoryPath}
      searchParams={searchParams}
    />
  );
}

export default CategoryPathPage;
