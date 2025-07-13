// Shared translation logic
type TranslationFunction = (key: string) => string;

/**
 * Shared logic for building full category names
 */
export function buildFullCategoryName(
  pathSegments: string[] | string,
  tCategory: TranslationFunction,
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

  if (options?.returnAs === "array") {
    return name.split(" - ");
  }

  return name;
}

/**
 * Shared logic for getting category name
 */
export function buildCategoryName(
  category: string,
  tCategory: TranslationFunction,
): string {
  return tCategory(`${category}.name`);
}

/**
 * Shared logic for getting subcategory name
 */
export function buildSubCategoryName(
  category: string,
  subCategory: string,
  tCategory: TranslationFunction,
): string {
  return tCategory(`${category}.categories.${subCategory}.name`);
}

/**
 * Shared logic for getting recursive category name
 */
export function buildRecursiveCategoryName(
  pathSegments: string[] | string,
  tCategory: TranslationFunction,
): string {
  // Convert string to array if necessary
  const segments = Array.isArray(pathSegments)
    ? pathSegments
    : pathSegments.split("/");

  if (segments.length === 0) return "";

  let translationPath = segments[0]!;
  for (let i = 1; i < segments.length; i++) {
    translationPath += `.categories.${segments[i]}`;
  }
  translationPath += ".name";
  return tCategory(translationPath);
}
