"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  onLoad?: () => void;
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
  onLoad,
}: GalleryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] transform-gpu">
      {/* Keep a stable paint surface while near-active carousel images decode. */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10 bg-blue-100/40 transform-gpu" />
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
          decoding="async"
          className={`rounded-[inherit] transform-gpu will-change-[opacity] transition-opacity duration-300 ease-out ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
          onLoadingComplete={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}
