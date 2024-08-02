import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { env } from "@/env";

const title = "Bee3Online";
const description =
  "Bee3Online is a platform made for selling and buying online completely for free!";
export const metadata: Metadata = {
  metadataBase: new URL(env.NEXTAUTH_URL),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  keywords: ["Bee3Online", "Bee3", "Sell", "Buy", "Shop", "Online"],
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
