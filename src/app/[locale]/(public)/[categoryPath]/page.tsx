import ShowingAdsPage from "@/components/bee3/showing-ads-page";

type Props = {
  params: { categoryPath: string };
  searchParams: { [key: string]: string | undefined };
};

function CategoryPathPage({ params, searchParams }: Props) {
  return (
    <ShowingAdsPage
      categoryPath={params.categoryPath}
      searchParams={searchParams}
    />
  );
}

export default CategoryPathPage;
