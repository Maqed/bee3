import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  categoriesTree,
  type CategoryTreeItem,
} from "@/schema/categories-tree";
import { Button } from "@/components/ui/button";
import { BackwardArrow, ForwardArrow } from "@/components/ui/arrows";
import { toPathFormat, getCategoryIcon } from "@/lib/category";
import { useCategoryTranslations } from "@/lib/category-synchronous";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface NavigationLevel {
  categories: CategoryTreeItem[];
  title: string;
  path: string[];
}

function CategoryChooseStepperMobile({
  onChoice,
  defaultPath = "",
  categories = categoriesTree,
}: {
  onChoice: (chosenCategory: CategoryTreeItem) => void;
  defaultPath?: string;
  categories?: CategoryTreeItem[];
}) {
  const t = useTranslations("category-stepper");
  const { getRecursiveCategoryName } = useCategoryTranslations();

  const [navigationHistory, setNavigationHistory] = useState<NavigationLevel[]>(
    [
      {
        categories,
        title: t("title"),
        path: [],
      },
    ],
  );

  const currentLevel = navigationHistory[navigationHistory.length - 1]!;

  const getCategoryDisplayName = (
    category: CategoryTreeItem,
    currentPath: string[],
  ) => {
    try {
      // Build the path segments for this category
      const pathSegments = [
        defaultPath,
        ...currentPath,
        toPathFormat(category.name),
      ];
      return getRecursiveCategoryName(pathSegments);
    } catch {
      // Fallback to the original name if translation fails
      return category.name;
    }
  };

  const handleCategoryClick = (category: CategoryTreeItem) => {
    // If category has subcategories, navigate to them
    if (category.categories && category.categories.length > 0) {
      const displayName = getCategoryDisplayName(category, currentLevel.path);
      const newLevel: NavigationLevel = {
        categories: category.categories,
        title: displayName,
        path: [...currentLevel.path, toPathFormat(category.name)],
      };
      setNavigationHistory([...navigationHistory, newLevel]);
    } else {
      // If no subcategories, this is a leaf category - call onChoice
      onChoice(category);
    }
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      setNavigationHistory(navigationHistory.slice(0, -1));
    }
  };

  const handleBreadcrumbClick = (targetLevel: number) => {
    if (targetLevel < navigationHistory.length - 1) {
      setNavigationHistory(navigationHistory.slice(0, targetLevel + 1));
    }
  };

  const isAtRoot = navigationHistory.length === 1;

  return (
    <div className="w-full space-y-4">
      {/* Header with back button and title */}
      <div className="flex items-center gap-3">
        {!isAtRoot && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="flex-shrink-0"
          >
            <BackwardArrow className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-lg font-semibold">{currentLevel.title}</h2>
      </div>

      {/* Breadcrumb navigation */}
      {navigationHistory.length > 1 && (
        <Breadcrumb>
          <BreadcrumbList>
            {navigationHistory.map((level, index) => {
              const isLast = index === navigationHistory.length - 1;

              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{level.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleBreadcrumbClick(index)}
                      >
                        {level.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Categories grid */}
      <div className="flex w-full flex-col gap-3">
        {currentLevel.categories.map((category) => {
          const displayName = getCategoryDisplayName(
            category,
            currentLevel.path,
          );
          const CategoryIcon = isAtRoot ? getCategoryIcon(category) : null;

          return (
            <Button
              key={category.id}
              variant="outline"
              className="h-auto w-full justify-start p-4 text-start"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {CategoryIcon && (
                    <CategoryIcon className="size-5 text-primary" />
                  )}
                  {displayName}
                </div>
                {category.categories && category.categories.length > 0 && (
                  <ForwardArrow className="size-4" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryChooseStepperMobile;
