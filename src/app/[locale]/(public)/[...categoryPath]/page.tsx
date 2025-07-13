import ShowingAdsPage from "@/components/bee3/showing-ads/showing-ads-page";
import { getCategoryTranslations } from "@/lib/category-asynchronous";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { categoryPath: string[] };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: Props) {
  const { getRecursiveCategoryName } = await getCategoryTranslations();

  const localizedCategory = await getRecursiveCategoryName(params.categoryPath);

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
