import ExploreCategories from "./_components/explore-categories";
import AdsCarousel from "@/components/bee3/ads-carousel";
import SellButton from "@/components/bee3/sell-button";
import { absoluteURL } from "@/lib/utils";

const NUMBER_OF_ADS_IN_CAROUSEL = 4;

export default async function HomePage() {
  const vehiclesResponse = await fetch(
    absoluteURL(
      `/api/bee3/search?category=vehicles&pageSize=${NUMBER_OF_ADS_IN_CAROUSEL}`,
    ),
    { method: "GET" },
  );
  const { ads: vehiclesAds } = await vehiclesResponse.json();
  const mobilesAndTabletsReponse = await fetch(
    absoluteURL(
      `/api/bee3/search?category=mobiles-and-tablets&pageSize=${NUMBER_OF_ADS_IN_CAROUSEL}`,
    ),
    { method: "GET" },
  );
  const { ads: mobilesAndTabletsAds } = await mobilesAndTabletsReponse.json();
  return (
    <main className="flex flex-col gap-y-5">
      <ExploreCategories />
      <AdsCarousel ads={vehiclesAds} categoryPath="vehicles" />
      <AdsCarousel
        ads={mobilesAndTabletsAds}
        categoryPath="mobiles-and-tablets"
      />
      <SellButton className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden" />
    </main>
  );
}
