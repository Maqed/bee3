import { useTranslations } from "next-intl";

export function useCategoryTranslations() {
  const tCategory = useTranslations("categories");

  // Function overloads for type safety
  function getSynchronousFullCategory(
    pathSegments: string[] | string,
    options: {
      returnAs: "array";
    },
  ): string[];
  function getSynchronousFullCategory(
    pathSegments: string[] | string,
    options?: {
      returnAs: "string";
    },
  ): string;
  function getSynchronousFullCategory(
    pathSegments: string[] | string,
    options?: {
      returnAs: "string" | "array";
    },
  ): string | string[] {
    // Convert string to array if necessary
    const segments = Array.isArray(pathSegments)
      ? pathSegments
      : pathSegments.split("/");

    if (segments.length === 0) return "";

    let translationPath = segments[0];
    let name = tCategory(`${segments[0]}.name`);

    for (let i = 1; i < segments.length; i++) {
      translationPath += `.categories.${segments[i]}`;
      name += ` - ${tCategory(`${translationPath}.name`)}`;
    }
    if (options?.returnAs == "array") {
      return name.split(" - ");
    }

    return name;
  }

  const getSynchronousCategory = (category: string) => {
    return tCategory(`${category}.name`);
  };

  const getSynchronousSubCategory = (category: string, subCategory: string) => {
    return tCategory(`${category}.categories.${subCategory}.name`);
  };

  const getRecursiveCategoryName = (
    pathSegments: string[] | string,
  ): string => {
    let translationPath = pathSegments[0];
    for (let i = 1; i < pathSegments.length; i++) {
      translationPath += `.categories.${pathSegments[i]}`;
    }
    translationPath += ".name";
    return tCategory(translationPath);
  };

  return {
    getSynchronousFullCategory,
    getSynchronousCategory,
    getSynchronousSubCategory,
    getRecursiveCategoryName,
  };
}
