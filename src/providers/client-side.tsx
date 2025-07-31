"use client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { DirectionProvider } from "@radix-ui/react-direction";
import type { ReactNode } from "react";
import { getQueryClient } from "./get-query-client";

type Props = {
  children: ReactNode;
};

function ClientSideProviders({ children }: Props) {
  const locale = useLocale();
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={locale === "ar" ? "rtl" : "ltr"}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </DirectionProvider>
    </QueryClientProvider>
  );
}

export default ClientSideProviders;
