import { Avatar } from "@/components/ui/avatar";
import { Link } from "@/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { getUserById } from "@/actions/users";
import { getTranslations } from "next-intl/server";

type Props = {
  params: {
    userId: string;
  };
};
export default async function UserPage({ params: { userId } }: Props) {
  const t = await getTranslations("/user/[userId]");
  const user = await getUserById(userId);
  if (!user) {
    return notFound();
  }
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col items-center gap-6 md:items-start">
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
        {/* Advertises  */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-xl font-bold md:text-2xl">
              {t("advertises.title")}
            </h3>
            {/* TODO: Add ACTUAL DATA */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-0 shadow-sm">
                <CardContent>
                  <img
                    src="/placeholder.svg"
                    width={400}
                    height={225}
                    alt="Advert Image"
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <div className="mt-4 space-y-2">
                    <h4 className="text-lg font-semibold">
                      Acme Productivity App
                    </h4>
                    <p className="line-clamp-2 text-muted-foreground">
                      Boost your productivity with our all-in-one app. Manage
                      tasks, track time, and collaborate with your team.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent>
                  <img
                    src="/placeholder.svg"
                    width={400}
                    height={225}
                    alt="Advert Image"
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <div className="mt-4 space-y-2">
                    <h4 className="text-lg font-semibold">
                      Eco-Friendly Clothing Line
                    </h4>
                    <p className="line-clamp-2 text-muted-foreground">
                      Discover our sustainable fashion collection, crafted with
                      eco-friendly materials and ethical practices.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent>
                  <img
                    src="/placeholder.svg"
                    width={400}
                    height={225}
                    alt="Advert Image"
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <div className="mt-4 space-y-2">
                    <h4 className="text-lg font-semibold">
                      Smart Home Automation Kit
                    </h4>
                    <p className="line-clamp-2 text-muted-foreground">
                      Transform your home with our cutting-edge smart home
                      automation kit. Control your devices with ease.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent>
                  <img
                    src="/placeholder.svg"
                    width={400}
                    height={225}
                    alt="Advert Image"
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <div className="mt-4 space-y-2">
                    <h4 className="text-lg font-semibold">
                      Healthy Meal Delivery Service
                    </h4>
                    <p className="line-clamp-2 text-muted-foreground">
                      Enjoy delicious and nutritious meals delivered right to
                      your doorstep. Fuel your body with our healthy options.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
