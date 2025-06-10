"use client";
import { useTransition, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adSchemaClient } from "@/schema/ad";
import AdPageUI from "@/components/bee3/ad-page/ad-page-ui";
import SellForm from "./_components/sell-form";
import { toPathFormat } from "@/lib/utils";

function SellPage() {
  const [isPending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(null);
  type SellFormType = z.infer<typeof adSchemaClient>;
  const form = useForm<SellFormType>({
    resolver: zodResolver(adSchemaClient),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      categoryId: 0,
      images: [],
      governorateId: 0,
      cityId: 0,
      negotiable: false,
      categoryOptions: "",
    },
  });

  if (isPending)
    return (
      <AdPageUI
        isPreview={true}
        ad={{
          id: "preview",
          title: form.getValues("title"),
          price: form.getValues("price"),
          images: form.getValues("images").map((image, index) => ({
            adId: "preview",
            url: URL.createObjectURL(image),
            createdAt: new Date(),
            updatedAt: new Date(),
            id: index,
          })),
          cityId: form.getValues("cityId"),
          description: form.getValues("description")!,
          governorateId: form.getValues("governorateId"),
          negotiable: form.getValues("negotiable"),
          categoryPath: toPathFormat(selectedMainCategory ?? ""),
          createdAt: new Date(),
          updatedAt: new Date(),
          adAnalyticsId: "preview",
          tier: "Free",
          userId: session?.user.id!,
          user: {
            id: session?.user.id!,
            name: session?.user.name!,
            phoneNumber: session?.user.phoneNumber!,
            createdAt: session?.user.createdAt!,
          },
        }}
      />
    );
  return (
    <SellForm
      isPending={isPending}
      startTransition={startTransition}
      form={form}
      selectedMainCategory={selectedMainCategory}
      setSelectedMainCategory={setSelectedMainCategory}
    />
  );
}

export default SellPage;
