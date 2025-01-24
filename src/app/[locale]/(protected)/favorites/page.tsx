import { getTranslations } from "next-intl/server";
import Navbar from "@/components/navbar/navbar";
import { FavoriteAds } from "./_components/favorite-ads";
import { Heart } from "lucide-react";

async function FavoritesPage() {
  const tFavorites = await getTranslations("/favorites");
  return (
    <div>
      <Navbar />
      <main className="container mt-4 sm:mx-auto md:max-w-5xl">
        <h1 className="mb-5 flex items-center gap-3 text-3xl font-black">
          <Heart className="inline size-8 fill-red-600 text-red-600" />{" "}
          {tFavorites("title")}
        </h1>
        <FavoriteAds />
      </main>
    </div>
  );
}

export default FavoritesPage;
