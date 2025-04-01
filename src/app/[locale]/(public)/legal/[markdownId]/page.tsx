import { getMarkdownData, getSortedMarkdownData } from "@/lib/markdown";
import { getLocalizedTimeAgo } from "@/lib/utils";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { markdownId: string };
}): Promise<Metadata> {
  const locale = await getLocale();
  const markdownData = getSortedMarkdownData(locale, "legal");
  const { markdownId } = params;
  const post = markdownData.find((markdown) => markdown.id == markdownId);
  if (!post) {
    const tError = await getTranslations("errors.markdown");
    return {
      title: tError("not-found"),
    };
  }

  const { title } = post;
  return { title };
}

async function LegalPage({ params }: { params: { markdownId: string } }) {
  const locale = await getLocale();
  const markdownData = getSortedMarkdownData(locale, "legal");
  const { markdownId } = params;
  if (!markdownData.find((markdown) => markdown.id == markdownId))
    return notFound();
  const { title, date, contentHtml } = await getMarkdownData(
    locale,
    "legal",
    markdownId,
  );
  return (
    <main className="prose prose-lg md:prose-xl prose-slate dark:prose-invert container mx-auto px-6">
      <div className="!mb-16">
        <h1 className="!mb-0 mt-4 text-3xl">{title}</h1>
        <p className="!m-0">{getLocalizedTimeAgo(locale, date)}</p>
      </div>
      <article>
        <section dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </main>
  );
}

export default LegalPage;
