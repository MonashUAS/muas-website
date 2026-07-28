"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

// GalleryImage renders an optimized drone image with a subtle loading spinner and graceful error fallback.
export function GalleryImage({
  src,
  alt,
  fill = true,
  sizes = "(min-width: 1024px) 62vw, 100vw",
  className = "",
  priority = true,
  objectFit = "cover",
  onLoad,
}: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // checkLoadedStatus checks if the image is already complete in browser memory cache.
  const checkLoadedStatus = useCallback(
    (node: HTMLImageElement | null) => {
      if (node) {
        imgRef.current = node;
        if (node.complete && node.naturalWidth > 0) {
          setIsLoaded(true);
          onLoad?.();
        }
      }
    },
    [onLoad],
  );

  useEffect(() => {
    setHasError(false);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] transform-gpu">
      {/* Subtle loader spinner while downloading */}
      {!isLoaded && !hasError && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-600" />
        </div>
      )}

      {/* Error state fallback */}
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center text-b2 font-medium text-blue-800">
          Image unavailable
        </div>
      ) : (
        <Image
          ref={checkLoadedStatus}
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          priority={priority}
          draggable={false}
          className={`rounded-[inherit] transform-gpu ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          } ${className}`}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            setIsLoaded(false);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
}


