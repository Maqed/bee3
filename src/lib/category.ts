import {
  categoriesTree,
  CategoryTreeItem,
  CategoryAttributeDefinition,
} from "@/schema/categories-tree";

/**
 * Convert a string to a URL-friendly path format
 */
export function toPathFormat(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FFa-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extract category and subcategory from a category path
 */
export function getCategoryAndSubCategory(categoryPath: string[] | string) {
  const [category, subCategory] =
    typeof categoryPath === "string" ? categoryPath.split("/") : categoryPath;
  if (!category) {
    throw new Error("Invalid category");
  }
  return { category, subCategory };
}

/**
 * Get all subcategory paths for a given root path recursively
 */
export function getSubCategoryPaths(rootPath: string): string[] {
  const subPaths = Array<string>();

  const tree = getTreeFromPath(rootPath);
  if (tree) {
    for (const subTree of tree) {
      const subPath = `${rootPath}/${toPathFormat(subTree.name)}`;
      subPaths.push(subPath);
      subPaths.push(...getSubCategoryPaths(subPath));
    }
  }

  return subPaths;
}

/**
 * Traverse the categoriesTree structure to find the specified path within the tree
 * so that it's possible to get its children.
 */
export function getTreeFromPath(path: string): CategoryTreeItem[] {
  const segments = path.split("/");
  let tree = categoriesTree;
  for (const segment of segments) {
    const found = tree.find((c) => toPathFormat(c.name) == segment);
    if (!found) return [];
    tree = found.categories || [];
  }
  return tree;
}

/**
 * Checks if a category exists by ID
 */
export function categoryExists(
  id: number,
  categories: CategoryTreeItem[] = categoriesTree,
): boolean {
  return categories.some(
    (c) => c.id === id || (c.categories && categoryExists(id, c.categories)),
  );
}

/**
 * Checks if a category exists by path
 */
export function categoryPathExists(
  path: string,
  categories: CategoryTreeItem[] = categoriesTree,
  basePath: string = "",
): boolean {
  for (const category of categories) {
    const categoryPath = basePath
      ? `${basePath}/${toPathFormat(category.name)}`
      : toPathFormat(category.name);

    if (categoryPath === path) return true;

    if (
      category.categories &&
      categoryPathExists(path, category.categories, categoryPath)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Finds a category by ID
 */
export function findCategory(
  id: number,
  categories: CategoryTreeItem[] = categoriesTree,
): CategoryTreeItem | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.categories) {
      const found = findCategory(id, cat.categories);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find ancestor categories for a given category ID
 */
export function findAncestorCategories(
  categoryId: number,
  tree: CategoryTreeItem[] = categoriesTree,
  ancestors: CategoryTreeItem[] = [],
): CategoryTreeItem[] {
  for (const category of tree) {
    if (category.id === categoryId) {
      return ancestors;
    }

    if (category.categories) {
      // Create a new array with the current category added to ancestors
      const newAncestors = [...ancestors, category];
      const result = findAncestorCategories(
        categoryId,
        category.categories,
        newAncestors,
      );
      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
}

/**
 * Gets all applicable attributes for a category, including inherited ones if appropriate
 */
export function getApplicableAttributes(
  category: CategoryTreeItem,
  ancestorCategories: CategoryTreeItem[] = [],
): CategoryAttributeDefinition[] {
  let attributes: CategoryAttributeDefinition[] = [
    ...(category.attributes || []),
  ];

  // Add attributes from ancestors if inheritance is enabled
  if (
    category.inheritParentAttributes !== false &&
    ancestorCategories.length > 0
  ) {
    for (const ancestorCategory of ancestorCategories) {
      if (ancestorCategory.attributes) {
        // Add parent attributes, avoiding duplicates by name
        for (const parentAttr of ancestorCategory.attributes) {
          if (!attributes.some((a) => a.name === parentAttr.name)) {
            attributes.push(parentAttr);
          }
        }
      }
    }
  }

  return attributes;
}

/**
 * Get all first-level categories
 */
export function getFirstLevelCategories() {
  return categoriesTree.map((category) => ({
    id: category.id,
    name: category.name,
    path: toPathFormat(category.name),
  }));
}

/**
 * Get category by path
 */
export function getCategoryByPath(path: string): CategoryTreeItem | null {
  const segments = path.split("/");
  let currentLevel = categoriesTree;

  for (const segment of segments) {
    const found = currentLevel.find((c) => toPathFormat(c.name) === segment);
    if (!found) return null;

    if (segment === segments[segments.length - 1]) {
      return found; // Return the final category
    }

    if (!found.categories) return null;
    currentLevel = found.categories;
  }

  return null;
}
