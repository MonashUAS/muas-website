"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { compCarouselPhotos } from "../nfc-2025-data";

/**
 * Loop cyclic index within array boundaries.
 */
function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/**
 * Calculate cyclic offset relative to active slide.
 */
function getSlideOffset(
  index: number,
  activeIndex: number,
  length: number,
): number {
  let diff = index - activeIndex;
  const half = Math.floor(length / 2);
  while (diff > half) diff -= length;
  while (diff < -half) diff += length;
  return diff;
}

/**
 * Calculates transform, opacity, scale, brightness, and height for active and adjacent photo slides.
 * Active slide matches 100% container height to bring captions right beneath the image.
 */
function getPhotoSlideStyle(
  isActive: boolean,
  isActiveHovered: boolean,
  offset: number,
) {
  const isOffscreen = Math.abs(offset) > 1;

  return {
    height: isActive ? "100%" : "62%",
    maxWidth: isActive ? "880px" : "320px",
    opacity: isOffscreen ? 0 : isActive ? 1 : 0.45,
    filter: isActive ? "brightness(100%)" : "brightness(45%) contrast(90%)",
    pointerEvents: isOffscreen ? ("none" as const) : ("auto" as const),
    transform: `translateX(${offset * 175}%) translateY(0px) scale(${
      isActive
        ? isActiveHovered
          ? 1.03
          : 1
        : 0.82
    })`,
    width: isActive ? "78vw" : "28vw",
    zIndex: isActive ? 10 : 5 - Math.abs(offset),
  };
}

/**
 * Renders the "Highlights in Hamburg" competition photo carousel.
 * Mimics the Our Drones carousel (1 active center slide, 2 darker & smaller adjacent slides,
 * arrow-controlled), with a noticeably slower & smoother transition animation.
 */
export function NFCGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isActiveHovered, setIsActiveHovered] = useState(false);

  const photos = compCarouselPhotos;

  const navigateTo = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, photos.length));
    },
    [photos.length],
  );

  return (
    <section
      id="highlights-in-hamburg"
      className="relative flex scroll-mt-20 flex-col items-center overflow-hidden bg-black pt-10 pb-6 text-white sm:pt-14 sm:pb-8 lg:pt-16 lg:pb-10"
    >
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,74,173,0.22),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#000000_0%,rgba(0,17,38,0.4)_50%,#000000_100%)]" />

      {/* Header */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6 pt-2 text-center">
        <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.05em] text-white">
          Highlights in Hamburg
        </h2>
      </div>

      {/* Carousel Area */}
      <div className="relative z-10 flex w-full max-w-[1720px] flex-col items-center justify-center pt-4 pb-2 sm:pt-6 lg:pt-8">
        <div className="relative flex h-[280px] w-full items-center justify-center sm:h-[400px] lg:h-[480px]">
          {/* Arrow Navigation Controls */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 grid w-full -translate-y-1/2 grid-cols-[70px_minmax(0,1fr)_70px] items-center px-4 sm:grid-cols-[110px_minmax(0,1fr)_110px] sm:px-8 lg:px-12">
            <button
              type="button"
              onClick={() => navigateTo(activeIndex - 1)}
              className="pointer-events-auto inline-flex h-12 w-12 cursor-pointer items-center justify-center justify-self-center rounded-full border border-blue-400/30 bg-blue-950/80 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-300 hover:border-blue-400 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none sm:h-16 sm:w-16"
              aria-label="Show previous photo"
            >
              <LuChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            <button
              type="button"
              onClick={() => navigateTo(activeIndex + 1)}
              className="pointer-events-auto col-start-3 inline-flex h-12 w-12 cursor-pointer items-center justify-center justify-self-center rounded-full border border-blue-400/30 bg-blue-950/80 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-300 hover:border-blue-400 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 motion-reduce:transition-none sm:h-16 sm:w-16"
              aria-label="Show next photo"
            >
              <LuChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>

          {/* Photo Slides Container */}
          <div className="relative flex h-full w-full max-w-7xl items-center justify-center">
            {photos.map((photo, index) => {
              const offset = getSlideOffset(index, activeIndex, photos.length);
              const isActive = offset === 0;

              return (
                <button
                  key={photo.id}
                  type="button"
                  aria-label={
                    isActive
                      ? `Photo: ${photo.alt}`
                      : `View photo: ${photo.alt}`
                  }
                  className="absolute flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-blue-950/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  onMouseEnter={() => setIsActiveHovered(isActive)}
                  onMouseLeave={() => setIsActiveHovered(false)}
                  onClick={() =>
                    isActive
                      ? null
                      : navigateTo(index)
                  }
                  style={getPhotoSlideStyle(isActive, isActiveHovered, offset)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 85vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out"
                    priority={isActive || Math.abs(offset) === 1}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 max-w-2xl px-4 text-center text-b2 font-medium leading-relaxed text-blue-50/90 sm:mt-4 sm:text-b1">
          {photos[activeIndex]?.caption}
        </p>
      </div>
    </section>
  );
}
