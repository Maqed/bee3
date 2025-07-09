"use client";
import type React from "react";
import type { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "@/navigation";
import { useToast } from "@/components/ui/use-toast";
import { authClient } from "@/lib/auth-client";
import type { UseFormReturn } from "react-hook-form";
import type { adSchemaClient } from "@/schema/ad";
import type { z } from "zod";
import { uploadToR2 } from "@/lib/s3";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Scoped, useStepper } from "./stepper-config";
import Step1Category from "./step-1-category";
import Step2Information from "./step-2-information";
import StepperIndicator from "./stepper-indicator";

type SellFormProps = {
  startTransition: TransitionStartFunction;
  isPending: boolean;
  form: UseFormReturn<z.infer<typeof adSchemaClient>, any, undefined>;
  setIsSubmissionSuccessful: Dispatch<SetStateAction<boolean>>;
  setSubmittedFormData: Dispatch<
    SetStateAction<z.infer<typeof adSchemaClient> | null>
  >;
};

function SellForm({
  startTransition,
  isPending,
  form,
  setIsSubmissionSuccessful,
  setSubmittedFormData,
}: SellFormProps) {
  const tSell = useTranslations("/sell");
  const tErrors = useTranslations("errors./sell");
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  type SellFormType = z.infer<typeof adSchemaClient>;
  const onSubmit = async (data: SellFormType) => {
    if (!data.userContactMethod) {
      toast({
        title: tErrors(`submit.must-have-contact-method.title`),
        description: tErrors(`submit.must-have-contact-method.description`),
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      try {
        // Prepare user update data if any user fields were changed
        const userUpdateData: any = {};
        if (data.userName && data.userName !== session?.user.name) {
          userUpdateData.name = data.userName;
        }
        if (
          data.userContactMethod !== undefined &&
          data.userContactMethod !== session?.user.contactMethod
        ) {
          userUpdateData.contactMethod = data.userContactMethod;
        }

        // Update user information if any changes were made
        if (Object.keys(userUpdateData).length > 0) {
          await authClient.updateUser({
            ...userUpdateData,
            fetchOptions: {
              onSuccess: () => {
                console.log("User information updated successfully");
              },
              onError: (error) => {
                console.error("Failed to update user information:", error);
              },
            },
          });
        }

        const images = await uploadToR2(data.images);

        toast({
          title: tSell("toast.loading.title"),
          description: tSell("toast.loading.description"),
          variant: "info",
        });

        const response = await fetch("/api/bee3/ad", {
          method: "POST",
          body: JSON.stringify({
            ...data,
            images,
          }),
        });

        const result = await response.json();
        if (!result.error) {
          // Store the submitted data before resetting
          setSubmittedFormData(data);
          setIsSubmissionSuccessful(true);
          toast({
            title: tSell("toast.submit-success"),
            variant: "success",
          });
          form.reset();
          router.push(`/ad/${result.result.id}`);
          router.refresh();
        } else {
          toast({
            title: tErrors(`submit.${result.error}.title`),
            description: tErrors(`submit.${result.error}.description`),
            variant: "destructive",
          });
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: tErrors("submit-error"),
          variant: "destructive",
        });
      }
    });
  };

  return (
    <main className="flex items-center justify-center sm:container sm:mx-auto sm:my-4">
      <Card className="w-full md:max-w-[1000px]">
        <CardHeader>
          <CardTitle>{tSell("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-8">
              <Scoped>
                <StepperIndicator />

                <StepContent isPending={isPending} form={form} tSell={tSell} />

                <StepperActions form={form} onSubmit={onSubmit} />
              </Scoped>
            </div>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}

function StepContent({
  isPending,
  form,
  tSell,
}: {
  isPending: boolean;
  form: UseFormReturn<z.infer<typeof adSchemaClient>, any, undefined>;
  tSell: any;
}) {
  const { current, next } = useStepper();

  switch (current.id) {
    case "category":
      return <Step1Category form={form} onNext={next} />;
    case "information":
      return (
        <Step2Information form={form} isPending={isPending} tSell={tSell} />
      );
    default:
      return null;
  }
}

function StepperActions({
  form,
  onSubmit,
}: {
  form: UseFormReturn<z.infer<typeof adSchemaClient>, any, undefined>;
  onSubmit: (data: any) => Promise<void>;
}) {
  const { next, prev, isFirst, isLast } = useStepper();
  const { isPending: isSessionPending } = authClient.useSession();
  const tSell = useTranslations("/sell");

  const canProceedToNext = () => {
    if (isLast) return false;

    return true;
  };

  return (
    <div className="flex justify-between">
      <Button type="button" variant="outline" onClick={prev} disabled={isFirst}>
        {tSell("stepper.previous")}
      </Button>

      <div className="flex gap-2">
        {!isLast ? (
          <Button type="button" onClick={next} disabled={!canProceedToNext()}>
            {tSell("stepper.next")}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSessionPending}
          >
            {tSell("submit")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default SellForm;
