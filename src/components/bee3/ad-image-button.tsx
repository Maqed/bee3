"use client";
import { useState } from "react";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { XCircleIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { MAX_AD_IMAGES } from "@/consts/ad";

type Props = {
  disabled?: boolean;
  onImagesChange: (images: File[]) => void;
  initialValue?: File[];
};

export function UploadAdImageButton({
  disabled = false,
  onImagesChange,
  initialValue = [],
}: Props) {
  const [images, setImages] = useState<File[]>(initialValue);
  const tErrors = useTranslations("errors./sell");
  const { toast } = useToast();

  const handleDrop = (acceptedFiles: File[]) => {
    const oversizedFiles = acceptedFiles.filter(
      (file) => file.size > 4 * 1024 * 1024,
    );

    if (oversizedFiles.length > 0) {
      toast({
        title: tErrors("image-size"),
        description: tErrors("image-size-description"),
        variant: "destructive",
      });
      return;
    }

    const newTotalImages = images.length + acceptedFiles.length;
    if (newTotalImages > MAX_AD_IMAGES) {
      toast({
        title: tErrors("max-images"),
        variant: "destructive",
      });
      return;
    }

    const newImages = [...images, ...acceptedFiles];
    setImages(newImages);
    onImagesChange(newImages);
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);

    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className={cn("w-full", disabled && "cursor-not-allowed opacity-50")}>
      <div className="flex flex-wrap items-center gap-2">
        {images.map((image, index) => (
          <div key={`image-${index}`} className="relative size-20 md:size-40">
            <button
              type="button"
              disabled={disabled}
              className="absolute -end-1 -top-1 z-10"
              onClick={() => removeImage(index)}
            >
              <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
            </button>
            <Image
              src={URL.createObjectURL(image)}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="rounded-md border border-border object-cover"
            />
          </div>
        ))}
        {[...Array(MAX_AD_IMAGES - images.length)].map(() => (
          <Dropzone
            disabled={disabled}
            onDrop={handleDrop}
            accept={{
              "image/png": [".png", ".jpg", ".jpeg", ".webp"],
            }}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "flex size-20 items-center justify-center rounded-md border border-dashed focus:border-primary focus:outline-none md:size-40",
                  {
                    "border-primary bg-secondary": isDragActive && isDragAccept,
                    "border-destructive bg-destructive/20":
                      isDragActive && isDragReject,
                    "cursor-not-allowed": disabled,
                  },
                )}
              >
                <input {...getInputProps()} disabled={disabled} />
                <ImageIcon
                  className={cn(
                    "h-10 w-10",
                    disabled ? "text-muted-foreground" : "",
                  )}
                  strokeWidth={1.25}
                />
              </div>
            )}
          </Dropzone>
        ))}
      </div>
    </div>
  );
}
