import ShowingAdsPage from "@/components/bee3/showing-ads/showing-ads-page";
import { getCategoryByPath } from "@/lib/category";
import { getCategoryTranslations } from "@/lib/category-asynchronous";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: { categoryPath: string[] };
  searchParams: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: Props) {
  const { getRecursiveCategoryName } = await getCategoryTranslations();

  if (!getCategoryByPath(params.categoryPath.join("/"))) {
    return notFound();
  }

  const localizedCategory = await getRecursiveCategoryName(params.categoryPath);

  const t = await getTranslations("/[categoryPath].metadata");

  return {
    title: localizedCategory,
    description: t("description", { category: localizedCategory }),
  };
}

function CategoryPathPage({ params, searchParams }: Props) {
  if (!getCategoryByPath(params.categoryPath.join("/"))) {
    return notFound();
  }
  return (
    <ShowingAdsPage
      categoryPath={params.categoryPath}
      searchParams={searchParams}
    />
  );
}

export default CategoryPathPage;
