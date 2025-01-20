"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { DirectionProvider } from "@radix-ui/react-direction";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient();

function ClientSideProviders({ children }: Props) {
  const locale = useLocale();
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>
            {children}
          </DirectionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default ClientSideProviders;
