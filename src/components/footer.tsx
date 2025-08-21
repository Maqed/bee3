import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { FaFacebook } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Logo from "./bee3/logo";
import { cn } from "@/lib/utils";

export default function Footer() {
  const t = useTranslations("footer");

  const footerLinks = {
    bee3: [
      { name: t("links.bee3.about-us"), href: "/about-us" },
      { name: t("links.bee3.privacy"), href: "/legal/privacy-policy" },
      { name: t("links.bee3.terms"), href: "/legal/terms-of-service" },
    ],
  };

  const socialLinks = [
    {
      icon: FaFacebook,
      name: t("social.facebook"),
      href: "https://www.facebook.com/profile.php?id=61577277553400",
      className: "text-[#106AFE]",
    },
  ];
  return (
    <footer id="footer" className="container">
      <div className="rounded-lg">
        <div className="flex flex-col py-12 pb-16 md:pb-12">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-1 text-primary">
                <Logo />
              </Link>
              <p className="text-sm text-muted-foreground md:max-w-[250px]">
                {t("about.description")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-3">
                <h4 className="text-base font-semibold">
                  {t("links.bee3.title")}
                </h4>
                <ul className="space-y-2">
                  {footerLinks.bee3.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-accent" />
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t("copyright")}</p>
            <div className="flex items-center space-x-4">
              <ul className="flex items-center gap-4">
                {socialLinks.map(
                  ({ icon: Icon, href, className, name }, idx) => (
                    <li key={`footer-social-${idx}`}>
                      <Link
                        href={href}
                        target="_blank"
                        className="group inline-flex cursor-pointer items-center justify-start gap-1 text-muted-foreground duration-200 hover:text-foreground hover:opacity-90"
                      >
                        <div className="sr-only">{name}</div>
                        <Icon className={cn("size-6", className)} />
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
