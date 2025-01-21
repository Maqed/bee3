"use client";
import { useDropzone } from "@uploadthing/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { MAX_AD_IMAGES } from "@/consts/ad";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  disabled?: boolean;
  onImagesChange: (images: File[]) => void; // New prop
};

export function UploadAdImageButton({ disabled, onImagesChange }: Props) {
  const [images, setImages] = useState<File[]>([]);
  const tSell = useTranslations("/sell");
  const { toast } = useToast();
  const onDrop = (acceptedFiles: File[]) => {
    const oversizedFiles = acceptedFiles.filter(
      (file) => file.size > 4 * 1024 * 1024,
    ); // Check if file size is greater than 4MB
    if (oversizedFiles.length > 0) {
      toast({
        title: tSell("errors.image-size"),
        description: tSell("errors.image-size-description"),
        variant: "destructive",
      });
      return; // Exit if there are oversized files
    }

    if (acceptedFiles.length + images.length <= MAX_AD_IMAGES) {
      setImages((prevFiles) => {
        const newImages = [...prevFiles, ...acceptedFiles];
        onImagesChange(newImages); // Call the new prop to update form images
        return newImages;
      });
    } else {
      toast({
        title: tSell("errors.max-images"),
        variant: "destructive",
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Accept only image files
  });
  return (
    <div
      className={cn(
        "flex w-full flex-col flex-wrap items-center",
        disabled && "cursor-not-allowed opacity-80",
      )}
    >
      <div className="w-full" {...getRootProps()}>
        <input {...getInputProps()} disabled={disabled} className="w-full" />
        <div className="flex w-full flex-col items-center justify-center gap-5 border py-10">
          <Upload className="h-10 w-10" />
          <div>{tSell("images.drop-images")}</div>
          <div>{tSell("images.or")}</div>
          <Button type="reset" variant="outline">
            {tSell("images.browse-images")}
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center">
        {images.length > 0 && (
          <>
            {images.map((image, index) => (
              <div
                className="relative"
                key={`image-container-${image.name}-${index}`}
              >
                <Button
                  type="button"
                  variant="destructive"
                  className="absolute end-0 top-0 z-10 h-4 w-4 rounded-none p-0"
                  onClick={() => {
                    setImages((prevImages) => {
                      const newImages = [
                        ...prevImages.slice(0, index),
                        ...prevImages.slice(index + 1, prevImages.length),
                      ];
                      onImagesChange(newImages);
                      return newImages;
                    });
                  }}
                >
                  <X />
                </Button>
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded preview ${index}`}
                  width={104}
                  height={104}
                  className="rounded-md"
                />
              </div>
            ))}
          </>
        )}
        {/* Copied from https://stackoverflow.com/questions/4852017/how-to-initialize-an-arrays-length-in-javascript */}
        {Array.apply(null, Array(MAX_AD_IMAGES - images.length)).map((_) => {
          return (
            <Image
              src={`https://placehold.co/100?text=${tSell("images.placeholder")}`}
              alt="placeholder"
              className="border border-primary"
              width={100}
              height={100}
            />
          );
        })}
      </div>
    </div>
  );
}
