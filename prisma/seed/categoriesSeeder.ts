import { db } from "@/server/db";
import {
  categoriesTree,
  CategoryTreeItem,
  CategoryAttributeDefinition,
} from "src/schema/categories-tree";
import { toPathFormat } from "@/lib/category";

async function getCategoryAttributes(
  item: CategoryTreeItem,
  parentPath: string | undefined = undefined,
): Promise<CategoryAttributeDefinition[]> {
  let attributes: CategoryAttributeDefinition[] = [...(item.attributes || [])];

  if (parentPath && item.inheritParentAttributes !== false) {
    const parentCategory = await db.category.findUnique({
      where: { path: parentPath },
      include: { attributes: true },
    });

    if (parentCategory) {
      const parentAttributes = await db.categoryAttribute.findMany({
        where: { categoryId: parentCategory.id },
      });

      const parentAttributeDefs: CategoryAttributeDefinition[] =
        parentAttributes.map((attr) => ({
          name: attr.name,
          type: attr.type as "number" | "select",
          required: attr.required,
          options: attr.options ? attr.options.split(",") : undefined,
          unit: attr.unit || undefined,
        }));

      for (const parentAttr of parentAttributeDefs) {
        if (!attributes.some((a) => a.name === parentAttr.name)) {
          attributes.push(parentAttr);
        }
      }
    }
  }

  return attributes;
}

async function populateItemTree(
  items: CategoryTreeItem[],
  depth = 0,
  parentPath: string | undefined = undefined,
) {
  if (!items) return;

  for (const item of items) {
    const path = parentPath
      ? `${parentPath}/${toPathFormat(item.name)}`
      : toPathFormat(item.name);
    console.log(`Creating category: ${path}`);

    // Create or update the category
    const category = await db.category.upsert({
      where: { id: item.id },
      update: {
        id: item.id,
        path: path,
        description: item.description,
        depth: depth,
        parentCategory: parentPath
          ? { connect: { path: parentPath } }
          : undefined,
      },
      create: {
        id: item.id,
        path: path,
        description: item.description,
        depth: depth,
        parentCategory: parentPath
          ? { connect: { path: parentPath } }
          : undefined,
      },
    });

    // Get attributes including inherited ones
    const attributes = await getCategoryAttributes(item, parentPath);

    // Create attributes for this category
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        console.log(`Adding attribute: ${attr}`);
        await db.categoryAttribute.upsert({
          where: {
            categoryId_name: {
              categoryId: category.id,
              name: attr.name,
            },
          },
          update: {
            type: attr.type,
            required: attr.required || false,
            options: attr.options ? attr.options.join(",") : null,
            unit: attr.unit || null,
          },
          create: {
            name: attr.name,
            type: attr.type,
            required: attr.required || false,
            options: attr.options ? attr.options.join(",") : null,
            unit: attr.unit || null,
            category: {
              connect: { id: category.id },
            },
          },
        });
      }
    }

    // Recursively process child categories
    if (item.categories) {
      await populateItemTree(item.categories, depth + 1, path);
    }
  }
}

export function seedCategories() {
  populateItemTree(categoriesTree);
}
