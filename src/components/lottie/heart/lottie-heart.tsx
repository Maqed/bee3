import React, { useEffect, useRef, useMemo } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import heartData from "./heart.json";
import { cn } from "@/lib/utils";

interface LottieHeartProps {
  className?: string;
  "aria-label"?: string;
  isFavorited?: boolean;
}

function LottieHeart({
  className,
  "aria-label": ariaLabel,
  isFavorited = false,
  ...props
}: LottieHeartProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Dynamically modify animation data based on favorited state
  const modifiedHeartData = useMemo(() => {
    const data = JSON.parse(JSON.stringify(heartData)); // Deep clone

    if (data.layers) {
      data.layers.forEach((layer: any) => {
        if (layer.nm === "heart") {
          // Stroke layer - always visible
          layer.ks.o.a = 0;
          layer.ks.o.k = 100;
        } else if (layer.nm === "heart Fill") {
          // Fill layer - show only when favorited
          layer.ks.o.a = 0;
          layer.ks.o.k = isFavorited ? 100 : 0;
        }
      });
    }

    return data;
  }, [isFavorited]);

  useEffect(() => {
    if (lottieRef.current) {
      // Play animation when favorite state changes
      lottieRef.current.stop();
      lottieRef.current.play();
    }
  }, [isFavorited]);

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      aria-label={ariaLabel}
    >
      <Lottie
        {...props}
        lottieRef={lottieRef}
        animationData={modifiedHeartData}
        loop={false}
        autoplay={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

export default LottieHeart;
