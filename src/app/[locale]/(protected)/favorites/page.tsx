"use client";
import { useTranslations } from "next-intl";
import Navbar from "@/components/navbar/navbar";
function FavoritesPage() {
  const tFavorites = useTranslations("/favorites");
  return (
    <div>
      <Navbar />
      <main className="container mt-4 sm:mx-auto md:max-w-4xl">
        <h1>{tFavorites("title")}</h1>
      </main>
    </div>
  );
}

export default FavoritesPage;
