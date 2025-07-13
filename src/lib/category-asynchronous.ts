import { getTranslations } from "next-intl/server";
import {
  buildFullCategoryName,
  buildCategoryName,
  buildSubCategoryName,
  buildRecursiveCategoryName,
} from "./category-translations";

export async function getCategoryTranslations() {
  const tCategory = await getTranslations("categories");

  // Function overloads for type safety
  async function getAsynchronousFullCategory(
    pathSegments: string[] | string,
    options: {
      returnAs: "array";
    },
  ): Promise<string[]>;
  async function getAsynchronousFullCategory(
    pathSegments: string[] | string,
    options?: {
      returnAs: "string";
    },
  ): Promise<string>;
  async function getAsynchronousFullCategory(
    pathSegments: string[] | string,
    options?: {
      returnAs: "string" | "array";
    },
  ): Promise<string | string[]> {
    return buildFullCategoryName(pathSegments, tCategory, options);
  }

  const getAsynchronousCategory = async (category: string) => {
    return buildCategoryName(category, tCategory);
  };

  const getAsynchronousSubCategory = async (
    category: string,
    subCategory: string,
  ) => {
    return buildSubCategoryName(category, subCategory, tCategory);
  };

  const getRecursiveCategoryName = async (
    pathSegments: string[] | string,
  ): Promise<string> => {
    return buildRecursiveCategoryName(pathSegments, tCategory);
  };

  return {
    getAsynchronousFullCategory,
    getAsynchronousCategory,
    getAsynchronousSubCategory,
    getRecursiveCategoryName,
  };
}
