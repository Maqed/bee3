import { db } from "@/server/db";
import { categoriesTree, CategoryTreeItem } from "src/schema/categories-tree";

async function populateItemTree(items: CategoryTreeItem[], depth = 0, parentPath: string | undefined = undefined) {
    if (!items) return;

    for (const item of items) {
        const path = parentPath ? `${parentPath}/${item.name}` : item.name;
        console.log(path);

        await db.category.upsert({
            where: { path: path },
            update: {
                path: path,
                name: item.name,
                description: item.description,
                depth: depth,
                parentCategory: parentPath ? { connect: { path: parentPath } } : undefined
            },
            create: {
                path: path,
                name: item.name,
                description: item.description,
                depth: depth,
                parentCategory: parentPath ? { connect: { path: parentPath } } : undefined
            }
        });
        populateItemTree(item.categories as CategoryTreeItem[], depth + 1, path);
    }
}

export function seedCategories() {
    populateItemTree(categoriesTree.categories as CategoryTreeItem[]);
}