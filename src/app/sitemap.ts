import { MetadataRoute } from "next";
import { env } from "@/env";
import { categoriesTree, CategoryTreeItem } from "@/schema/categories-tree";
import { toPathFormat } from "@/lib/category";

/**
 * Recursively get all category paths from the categories tree
 */
function getAllCategoryPaths(
  categories: CategoryTreeItem[] = categoriesTree,
  basePath: string = "",
): string[] {
  const paths: string[] = [];

  for (const category of categories) {
    const categoryPath = basePath
      ? `${basePath}/${toPathFormat(category.name)}`
      : toPathFormat(category.name);

    paths.push(categoryPath);

    // Recursively get subcategory paths
    if (category.categories) {
      paths.push(...getAllCategoryPaths(category.categories, categoryPath));
    }
  }

  return paths;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Homepage
  sitemapEntries.push({
    url: `${baseURL}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
    alternates: {
      languages: {
        ar: `${baseURL}/`,
        en: `${baseURL}/en`,
      },
    },
  });

  // about-us
  sitemapEntries.push({
    url: `${baseURL}/`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
    alternates: {
      languages: {
        ar: `${baseURL}/about-us`,
        en: `${baseURL}/en/about-us`,
      },
    },
  });

  // Ads page
  sitemapEntries.push({
    url: `${baseURL}/ads`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
    alternates: {
      languages: {
        ar: `${baseURL}/ads`,
        en: `${baseURL}/en/ads`,
      },
    },
  });

  // Legal pages
  const legalPages = ["privacy-policy", "terms-of-service"];
  for (const page of legalPages) {
    sitemapEntries.push({
      url: `${baseURL}/legal/${page}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          ar: `${baseURL}/legal/${page}`,
          en: `${baseURL}/en/legal/${page}`,
        },
      },
    });
  }

  // Legal index page
  sitemapEntries.push({
    url: `${baseURL}/legal`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
    alternates: {
      languages: {
        ar: `${baseURL}/legal`,
        en: `${baseURL}/en/legal`,
      },
    },
  });

  // Get all category paths recursively
  const categoryPaths = getAllCategoryPaths();

  // Add category pages to sitemap
  for (const categoryPath of categoryPaths) {
    sitemapEntries.push({
      url: `${baseURL}/${categoryPath}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
      alternates: {
        languages: {
          ar: `${baseURL}/${categoryPath}`,
          en: `${baseURL}/en/${categoryPath}`,
        },
      },
    });
  }

  return sitemapEntries;
}
