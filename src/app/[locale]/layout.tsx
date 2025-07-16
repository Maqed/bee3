import "@/styles/globals.css";
import { Outfit, Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import ServerSideProviders from "@/providers/server-side";
import ClientSideProviders from "@/providers/client-side";
import { getMessages, getTranslations } from "next-intl/server";
import { Databuddy } from "@databuddy/sdk";

const font = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const arFont = Cairo({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
});

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const ogImageUrl = `${baseUrl}/og.png`;

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
      url: baseUrl,
      locale: t("locale"),
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: description,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
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
        className={`${font.className}`}
      >
        <body>
          <ClientSideProviders>{children}</ClientSideProviders>
          <Toaster />
          <Databuddy clientId="lSOc5xZejKB-0TKWvJ4qG" enableBatching={true} />
        </body>
      </html>
    </ServerSideProviders>
  );
}
