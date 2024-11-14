import { db } from "@/server/db";
import { categoriesTree, CategoryTreeItem } from "src/schema/categories-tree";

async function populateItemTree(items: CategoryTreeItem[], depth = 0, parentId: number | undefined = undefined) {
    if (!items) return;

    for (const item of items) {
        console.log(item.id);

        await db.category.upsert({
            where: { id: item.id },
            update: {
                name_en: item.name_en,
                name_ar: item.name_ar,
                description: item.description,
                depth: depth,
                parentCategory: parentId ? { connect: { id: parentId } } : undefined
            },
            create: {
                id: item.id,
                name_en: item.name_en,
                name_ar: item.name_ar,
                description: item.description,
                depth: depth,
                parentCategory: parentId ? { connect: { id: parentId } } : undefined
            }
        });
        if (item.categories)
            populateItemTree(item.categories, depth + 1, item.id);
    }
}

export function seedCategories() {
    populateItemTree(categoriesTree);
}