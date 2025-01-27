"use client";
import Image from "next/image";
import Dropzone from "react-dropzone";
import { XCircleIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { MAX_AD_IMAGES } from "@/consts/ad";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";

function DraggableImage({
  index,
  disabled,
  removeImage,
  image,
}: {
  index: number;
  disabled: boolean;
  removeImage: () => void;
  image: File;
}) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
  } = useDraggable({
    id: `image-${index}`,
  });
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: `image-${index}`,
  });

  const imageUrl = useMemo(() => URL.createObjectURL(image), [image]);

  return (
    <div
      ref={(node) => {
        setDraggableNodeRef(node);
        setDroppableNodeRef(node);
      }}
      key={`image-${index}`}
      className="relative size-16 md:size-24"
    >
      <button
        type="button"
        disabled={disabled}
        className="absolute -end-1 -top-1 z-10"
        onClick={removeImage}
      >
        <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
      </button>
      <Image
        src={imageUrl}
        alt={`Uploaded image ${index + 1}`}
        fill
        className="cursor-move rounded-md border border-border object-cover"
        {...attributes}
        {...listeners}
      />
    </div>
  );
}

type Props = {
  disabled?: boolean;
  onImagesChange: (images: File[]) => void;
  images: File[];
};

export function UploadAdImageButton({
  disabled = false,
  onImagesChange,
  images,
}: Props) {
  const tErrors = useTranslations("errors./sell");
  const { toast } = useToast();
  const [imageBeingDragged, setImageBeingDragged] = useState<string | null>(
    null,
  );

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
    onImagesChange(newImages);
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  function handleDragStart(event: DragStartEvent) {
    setImageBeingDragged(event.active.id.toString());
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!active.id || !over?.id) return;

    const activeIndex = Number(active.id.toString().split("-")[1]);
    const overIndex = Number(over.id.toString().split("-")[1]);
    const newImages = [...images];
    if (
      newImages[activeIndex] === undefined ||
      newImages[overIndex] === undefined
    )
      return;

    [newImages[activeIndex], newImages[overIndex]] = [
      newImages[overIndex],
      newImages[activeIndex],
    ];
    onImagesChange(newImages);

    setImageBeingDragged(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={cn(
          "flex w-full flex-wrap items-center gap-2",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {images.map((image, index) => (
          <DraggableImage
            key={`image-${index}`}
            disabled={disabled}
            image={image}
            index={index}
            removeImage={() => removeImage(index)}
          />
        ))}
        {[...Array(MAX_AD_IMAGES - images.length)].map((number) => (
          <Dropzone
            key={`dropzone-${number}`}
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
                  "flex size-16 items-center justify-center rounded-md border border-dashed focus:border-primary focus:outline-none md:size-24",
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
        <DragOverlay>
          {imageBeingDragged ? (
            <Image
              src={URL.createObjectURL(
                images[
                  Number(imageBeingDragged[imageBeingDragged.length - 1])
                ]!,
              )}
              alt={"Image being Dragged"}
              fill
              className="cursor-move rounded-md border border-border object-cover opacity-50"
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
