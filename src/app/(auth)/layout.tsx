export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="h-screen-without-navbar flex w-full items-center justify-center">
      {children}
    </main>
  );
}
