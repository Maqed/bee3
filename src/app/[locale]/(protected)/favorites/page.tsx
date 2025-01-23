import { getTranslations } from "next-intl/server";
import Navbar from "@/components/navbar/navbar";
import { FavoriteAds } from "./_components/favorite-ads";

async function FavoritesPage() {
  const tFavorites = await getTranslations("/favorites");
  return (
    <div>
      <Navbar />
      <main className="container mt-4 sm:mx-auto md:max-w-5xl">
        <h1 className="text-3xl font-black">{tFavorites("title")}</h1>
        <FavoriteAds />
      </main>
    </div>
  );
}

export default FavoritesPage;
