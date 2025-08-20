import { getMarkdownData } from "@/lib/markdown";
import { getLocalizedTimeAgo } from "@/lib/utils";
import { getLocale } from "next-intl/server";

async function AboutUsPage() {
  const locale = await getLocale();
  const { title, date, contentHtml } = await getMarkdownData(
    locale,
    "",
    "about-us",
  );

  return (
    <main className="container prose prose-lg mx-auto px-6 md:prose-xl">
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

export default AboutUsPage;
