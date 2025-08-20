import { ReactNode } from "react";
import ExploreCategories from "@/components/bee3/explore-categories";
import SellButton from "@/components/bee3/sell-button";
function HomePageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col gap-y-5">
      <ExploreCategories />
      {children}
      <SellButton className="fixed bottom-4 left-1/2 -translate-x-1/2 transform bg-primary/95 md:hidden" />
    </main>
  );
}

export default HomePageLayout;
