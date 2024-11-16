import { db } from "@/server/db";
import { categoriesTree, CategoryTreeItem, toPathFormat } from "src/schema/categories-tree";

async function populateItemTree(items: CategoryTreeItem[], depth = 0, parentPath: string | undefined = undefined) {
    if (!items) return;

    for (const item of items) {
        const path = parentPath ? `${parentPath}/${toPathFormat(item.name_en)}` : toPathFormat(item.name_en);
        console.log(path);

        await db.category.upsert({
            where: { id: item.id },
            update: {
                id: item.id,
                path: path,
                name_en: item.name_en,
                name_ar: item.name_ar,
                description: item.description,
                depth: depth,
                parentCategory: parentPath ? { connect: { id: parentPath } } : undefined
            },
            create: {
                id: item.id,
                path: path,
                name_en: item.name_en,
                name_ar: item.name_ar,
                description: item.description,
                depth: depth,
                parentCategory: parentPath ? { connect: { id: parentPath } } : undefined
            }
        });
        if (item.categories)
            populateItemTree(item.categories, depth + 1, path);
    }
}

export function seedCategories() {
    populateItemTree(categoriesTree);
}

