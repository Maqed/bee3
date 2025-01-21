import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import { type Metadata } from "next";
import { env } from "@/env";
import ServerSideProviders from "@/providers/server-side";
import ClientSideProviders from "@/providers/client-side";

const title = "Bee3";
const description =
  "Bee3 is a platform made for selling and buying online completely for free!";
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXTAUTH_URL),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  keywords: ["Bee3", "Sell", "Buy", "Shop", "Live"],
  description,
  openGraph: {
    title: title,
    description: description,
    url: env.NEXTAUTH_URL,
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
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

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  return (
    <ServerSideProviders>
      <html
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`${GeistSans.variable}`}
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
