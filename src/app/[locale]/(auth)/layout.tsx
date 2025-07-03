import React from "react";
import Navbar from "@/components/navbar/navbar";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="h-screen-without-navbar flex w-full items-center justify-center pb-5">
        {children}
      </main>
    </>
  );
}
