import CategoryPage from "@/components/bee3/category-path-page";

type Props = {
  params: { categoryPath: string; subCategoryPath: string };
  searchParams: { [key: string]: string | undefined };
};

function CategoryPathPage({ params, searchParams }: Props) {
  return (
    <CategoryPage
      categoryPath={`${params.categoryPath}/${params.subCategoryPath}`}
      searchParams={searchParams}
    />
  );
}

export default CategoryPathPage;
