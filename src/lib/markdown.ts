import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { MarkdownPost } from "@/types/markdown";

const markdownDirectory = (locale: string, directoryPath: string) =>
  path.join(process.cwd(), `src/content/${locale}/${directoryPath}`);

export function getSortedMarkdownData(locale: string, directoryPath: string) {
  const fileNames = fs.readdirSync(markdownDirectory(locale, directoryPath));
  const allMarkdownData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(
      markdownDirectory(locale, directoryPath),
      fileName,
    );
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    const markdownPost: MarkdownPost = {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
      link: `/${directoryPath}/${id}`,
    };

    // Combine the data with the id
    return markdownPost;
  });
  // Sort posts by date
  return allMarkdownData.sort((a, b) => (a.date < b.date ? 1 : -1));
}
export async function getMarkdownData(
  locale: string,
  directoryPath: string,
  id: string,
) {
  const fullPath = path.join(
    markdownDirectory(locale, directoryPath),
    `${id}.md`,
  );
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  const markdownPostWithHTML: MarkdownPost & { contentHtml: string } = {
    id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    link: `/${directoryPath}/${id}`,
    contentHtml,
  };

  // Combine the data with the id
  return markdownPostWithHTML;
}
