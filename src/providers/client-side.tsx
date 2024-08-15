"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { useLocale } from "next-intl";
import { DirectionProvider } from "@radix-ui/react-direction";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function ClientSideProviders({ children }: Props) {
  const locale = useLocale();
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>
          {children}
        </DirectionProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default ClientSideProviders;
