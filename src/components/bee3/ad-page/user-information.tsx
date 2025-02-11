import { Link } from "@/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { getLocalizedTimeAgo } from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";
import { ContactInfo } from "./contact-info";

type UserInformationProps = {
  ad: AdWithUser;
  tAd: any;
  locale: string;
  variant?: "mobile" | "desktop";
};

export function UserInformation({
  ad,
  tAd,
  locale,
  variant = "desktop",
}: UserInformationProps) {
  if (variant === "mobile") {
    return (
      <Card className="md:hidden">
        <Link href={`/user/${ad.user?.id}`}>
          <CardHeader>
            <CardTitle>{tAd("user.posted-by")}</CardTitle>
          </CardHeader>
          <CardContent>
            <h5 className="text-lg font-bold">{ad.user?.name}</h5>
            <p>
              {tAd("user.member-since")}{" "}
              {getLocalizedTimeAgo(locale, ad.user?.createdAt)}
            </p>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <Link href={`/user/${ad.user?.id}`}>
        <CardHeader>
          <CardTitle>{tAd("user.posted-by")}</CardTitle>
        </CardHeader>
        <CardContent>
          <h5 className="text-lg font-bold">{ad.user?.name}</h5>
          <p>
            {tAd("user.member-since")}{" "}
            {getLocalizedTimeAgo(locale, ad.user?.createdAt)}
          </p>
        </CardContent>
      </Link>
      <CardFooter>
        <ContactInfo
          className="flex w-full flex-col gap-y-3"
          showTitle={true}
          phoneNumber={ad.user.phoneNumber}
        />
      </CardFooter>
    </Card>
  );
}
