"use client";

import { useCallback, useRef, useState } from "react";
import type { Drone } from "./drone-data";
import { DroneVisual } from "./DroneVisual";
import { useWheelNavigation } from "./useWheelNavigation";

type DroneImageCarouselProps = {
  drone: Drone;
  images: Array<string | undefined>;
};

// DroneImageCarousel is the component that renders the drone image gallery in the DroneDetailsModal. It supports mouse wheel and click navigation.
export function DroneImageCarousel({ drone, images }: DroneImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  // moveGallery advances through the gallery with wraparound.
  const moveGallery = useCallback(
    (direction: number) => {
      setActiveIndex((current) => wrapIndex(current + direction, images.length));
    },
    [images.length],
  );

  useWheelNavigation(galleryRef, {
    cooldownMs: 420,
    onStep: moveGallery,
    threshold: 8,
  });

  return (
    <div
      ref={galleryRef}
      aria-label={`${drone.name} image gallery`}
      className="relative mx-auto mt-16 flex h-44 w-full max-w-4xl items-center justify-center overflow-hidden sm:h-56"
    >
      {images.map((image, index) => {
        const offset = getShortestOffset(index, activeIndex, images.length);
        const isActive = offset === 0;

        return (
          <button
            aria-label={`Show ${drone.name} gallery image ${index + 1}`}
            className="absolute h-32 w-[38vw] max-w-sm min-w-40 cursor-pointer transition-all duration-500 ease-out sm:h-48"
            key={`${image ?? "placeholder"}-${index}`}
            onClick={() => setActiveIndex(index)}
            style={{
              opacity: isActive ? 1 : 0.42,
              transform: `translateX(${offset * 68}%) scale(${isActive ? 1 : 0.84})`,
              zIndex: isActive ? 2 : 1,
            }}
            type="button"
          >
            {image ? (
              <img
                alt={`${drone.name} gallery image ${index + 1}`}
                className="h-full w-full object-cover"
                draggable={false}
                src={image}
              />
            ) : (
              <DroneVisual drone={{ name: drone.name }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// wrapIndex keeps carousel indices inside the available image range.
function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

// getShortestOffset positions images around the active gallery item.
function getShortestOffset(index: number, activeIndex: number, length: number) {
  const offset = index - activeIndex;
  const half = length / 2;

  if (offset > half) {
    return offset - length;
  }

  if (offset < -half) {
    return offset + length;
  }

  return offset;
}
