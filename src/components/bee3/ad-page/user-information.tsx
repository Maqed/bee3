import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn, getLocalizedTimeAgo } from "@/lib/utils";
import type { AdWithUser } from "@/types/ad-page-types";
import { ContactMethod } from "./contact-method";

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
  return (
    <Card className={cn(variant === "mobile" ? "md:hidden" : "")}>
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
      {ad.user?.contactMethod ? (
        <CardFooter>
          <ContactMethod
            title={tAd("user.contact-method")}
            contactMethod={ad.user.contactMethod}
          />
        </CardFooter>
      ) : null}
    </Card>
  );
}
