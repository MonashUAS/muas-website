"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type GalleryImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
};

// GalleryImage renders an optimized image with GPU-accelerated smooth loading states and a lightweight loader spinner.
export function GalleryImage({
  src,
  alt,
  fill = true,
  sizes = "(min-width: 1024px) 62vw, 100vw",
  className = "",
  priority = false,
  objectFit = "cover",
}: GalleryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] transform-gpu">
      {/* Lightweight skeleton pulse & spinner overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-pulse transform-gpu">
          <Loader2 className="h-8 w-8 animate-spin text-blue-900/70 sm:h-10 sm:w-10" />
        </div>
      )}

      {/* Error state fallback */}
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center text-b2 font-medium text-blue-800">
          Image unavailable
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          draggable={false}
          className={`rounded-[inherit] transform-gpu will-change-[opacity] transition-opacity duration-300 ease-out ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}
