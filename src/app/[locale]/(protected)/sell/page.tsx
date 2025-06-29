"use client";
import { useTransition, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adSchemaClient } from "@/schema/ad";
import AdPageUI from "@/components/bee3/ad-page/ad-page-ui";
import SellForm from "@/components/bee3/sell/sell-form";
import { toPathFormat } from "@/lib/utils";

function SellPage() {
  const [isPending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(null);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<z.infer<
    typeof adSchemaClient
  > | null>(null);
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
      userName: "",
      userContactInfo: "",
    },
  });

  // Update form values when session becomes available
  useEffect(() => {
    if (session?.user) {
      form.setValue("userName", session.user.name || "");
      form.setValue("userContactInfo", session.user.contactInfo || "");
    }
  }, [session, form]);

  if (isPending && !isSubmissionSuccessful)
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

  if (isPending && isSubmissionSuccessful && submittedFormData)
    return (
      <AdPageUI
        isPreview={true}
        ad={{
          id: "preview",
          title: submittedFormData.title,
          price: submittedFormData.price,
          images: submittedFormData.images.map((image, index) => ({
            adId: "preview",
            url: URL.createObjectURL(image),
            createdAt: new Date(),
            updatedAt: new Date(),
            id: index,
          })),
          cityId: submittedFormData.cityId,
          description: submittedFormData.description!,
          governorateId: submittedFormData.governorateId,
          negotiable: submittedFormData.negotiable,
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
      setIsSubmissionSuccessful={setIsSubmissionSuccessful}
      setSubmittedFormData={setSubmittedFormData}
    />
  );
}

export default SellPage;
