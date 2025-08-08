import { useCategoryTranslations } from "@/lib/category-synchronous";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  categoryPath?: string[];
};

function ShowingAdsBreadcrumb({ categoryPath }: Props) {
  const { getSynchronousFullCategory } = useCategoryTranslations();
  const tBreadcrumb = useTranslations("showing-ads-page.breadcrumb");

  // Get the full category names as an array if categoryPath exists
  const categoryNames = categoryPath?.length
    ? getSynchronousFullCategory(categoryPath, { returnAs: "array" })
    : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link - always shown */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">{tBreadcrumb("home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Category breadcrumb items */}
        {categoryNames.map((categoryName, index) => {
          const isLast = index === categoryNames.length - 1;
          const currentPath = categoryPath!.slice(0, index + 1);
          const href = `/${currentPath.join("/")}`;

          return (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{categoryName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{categoryName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default ShowingAdsBreadcrumb;
