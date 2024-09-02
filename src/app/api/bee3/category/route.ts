import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/server/db";
import { categoriesTree, CategoryTreeItem } from '@/schema/categories-tree';
import path from 'path';


export async function GET(request: NextRequest) {
    const categoryPath = request.nextUrl.searchParams.get("path");

    console.log(categoryPath);

    if (!categoryPath)
        return NextResponse.json({ error: "invalid-categoryPath" }, { status: 400 });

    const ads = await db.ad.findMany({ where: { categoryPath: categoryPath } });

    for (const subPath of getSubCategoryPaths(categoryPath)) {
        ads.push(...await db.ad.findMany({ where: { categoryPath: subPath } }));
    }

    return NextResponse.json({ ads });
}

function getSubCategoryPaths(rootPath: string): string[] {
    const subPaths = Array<string>();

    const tree = getTreeFromPath(rootPath);
    if (tree) {
        for (const subTree of tree) {
            const subPath = path.join(rootPath, subTree.name);
            subPaths.push(subPath);
            subPaths.push(...getSubCategoryPaths(subPath));
        }
    }

    return subPaths;
}

function getTreeFromPath(path: string): CategoryTreeItem[] {
    const segments = path.split('/');
    let tree = categoriesTree.categories as CategoryTreeItem[];
    for (const segment of segments) {
        tree = tree.find(c => c.name == segment)!.categories as CategoryTreeItem[];
    }
    return tree;
}