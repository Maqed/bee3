import { Avatar } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { getUserById } from "@/database/users";
import { getTranslations } from "next-intl/server";
import { getServerAuthSession } from "@/lib/auth";

import { db } from "@/server/db";

import SellButton from "@/components/bee3/sell-button";
import AdCard from "@/components/bee3/ad-card";

type Props = {
  params: {
    userId: string;
  };
};

export default async function UserPage({ params: { userId } }: Props) {
  const t = await getTranslations("/user/[userId]");
  const session = await getServerAuthSession();
  const user = await getUserById(userId);
  if (!user) {
    return notFound();
  }

  const ads = await db.ad.findMany({
    where: {
      userId: userId, // Filter ads by userId
    },
  });

  return (
    <div className="mx-auto w-full py-8 md:px-8 md:py-12">
      <div className="grid gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 text-3xl font-bold md:h-32 md:w-32 md:text-5xl">
              {user.name?.charAt(0)}
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold md:text-3xl">{user.name}</h2>
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <p>{user.bio}</p>
          </div>
        </div>
        {/* Advertises */}
        <div>
          <h3 className="mb-4 text-center text-xl font-bold md:text-2xl">
            {t("advertises.title")}
          </h3>
          {ads.length === 0 ? ( // Check if the user has ads
            <div className="flex flex-col items-center justify-center">
              <h4 className="mb-3 text-2xl">
                {userId === session?.user.id
                  ? t("advertises.you-have-no-ads")
                  : t("advertises.user-has-no-ads")}
              </h4>
              {userId === session?.user.id && <SellButton />}{" "}
              {/* Show SellButton if the user is the session user */}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 px-3">
              {ads.map(
                (
                  ad, // Render ads if available
                ) => (
                  <AdCard key={`AD-card-${ad.id}`} ad={ad} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
