import ShowingAdsLayout from "@/components/bee3/showing-ads/showing-ads-layout";
import { getCategoryByPath } from "@/lib/category";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  params: { categoryPath: string[] };
  children: ReactNode;
};

function CategoryPathLayout({ children, params }: Props) {
  if (!getCategoryByPath(params.categoryPath.join("/"))) {
    return notFound();
  }
  return (
    <ShowingAdsLayout categoryPath={params.categoryPath}>
      {children}
    </ShowingAdsLayout>
  );
}

export default CategoryPathLayout;
