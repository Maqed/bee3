import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import ServerSideProviders from "@/providers/server-side";
import ClientSideProviders from "@/providers/client-side";
import { getMessages, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("metadata");
  const messages = await getMessages();
  const title = t("title");
  const description = t("description");
  // @ts-ignore
  const keywords = Object.values(messages.metadata.keywords);

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords,
    openGraph: {
      title,
      description,
      siteName: title,
      url: process.env.NEXTAUTH_URL,
      locale: t("locale"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  return (
    <ServerSideProviders>
      <html
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${GeistSans.className}`}
      >
        <body>
          <ClientSideProviders>
            {children}
            <Toaster />
          </ClientSideProviders>
        </body>
      </html>
    </ServerSideProviders>
  );
}
