"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

function DeleteAccountSection() {
  const t = useTranslations("/user-settings");

  return (
    <section>
      <h1 className="text-3xl font-bold text-destructive">
        {t("delete.title")}
      </h1>
      <hr className="my-2" />
      <p className="mb-2">
        {t.rich("delete.paragraph", {
          facebook: (chunks) => (
            <Link
              href="https://www.facebook.com/profile.php?id=61577277553400"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </section>
  );
}

export default DeleteAccountSection;
