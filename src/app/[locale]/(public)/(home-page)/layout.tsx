import { ReactNode } from "react";
import ExploreCategories from "@/components/bee3/explore-categories";
import SellButton from "@/components/bee3/sell-button";
function HomePageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col gap-y-5">
      <ExploreCategories />
      {children}
      <SellButton className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden" />
    </main>
  );
}

export default HomePageLayout;
