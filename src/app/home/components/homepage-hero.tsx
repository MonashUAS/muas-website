"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "../data/hero-slides";
import { usePrefersReducedMotion } from "../utils/use-prefers-reduced-motion";

const IMAGE_DURATION_MS = 5000;
const VIDEO_MAX_DURATION_MS = 12000;

// The homepage hero owns only slideshow behavior; slide content lives in data
// so the media sequence can be updated without touching interaction code.
export function HomepageHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const goToNextSlide = useCallback(() => {
    setActiveSlide((currentIndex) => (currentIndex + 1) % heroSlides.length);
  }, []);

  // Image slides advance by fixed timer; video slides advance onEnded, with
  // a max-duration fallback so a missing video event cannot freeze the hero.
  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const activeSlideData = heroSlides[activeSlide];
    const duration =
      activeSlideData.type === "image" ? IMAGE_DURATION_MS : VIDEO_MAX_DURATION_MS;
    const timeout = window.setTimeout(goToNextSlide, duration);

    return () => window.clearTimeout(timeout);
  }, [activeSlide, goToNextSlide, prefersReducedMotion]);

  // Background videos are mounted before they become visible, so the active
  // video is reset and played explicitly when its slide crossfades in.
  useEffect(() => {
    const activeSlideData = heroSlides[activeSlide];

    if (prefersReducedMotion || activeSlideData.type !== "video") {
      return;
    }

    const video = videoRefs.current[activeSlide];

    if (!video) {
      return;
    }

    video.currentTime = 0;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        goToNextSlide();
      });
    }
  }, [activeSlide, goToNextSlide, prefersReducedMotion]);

  const handleMediaError = useCallback(
    (index: number) => {
      // If the active asset fails to load, skip forward so one file cannot freeze the hero.
      if (!prefersReducedMotion && index === activeSlide) {
        goToNextSlide();
      }
    },
    [activeSlide, goToNextSlide, prefersReducedMotion],
  );

  const handleVideoEnded = useCallback(
    (index: number) => {
      // Videos advance from their natural ended event instead of replaying indefinitely.
      if (!prefersReducedMotion && index === activeSlide) {
        goToNextSlide();
      }
    },
    [activeSlide, goToNextSlide, prefersReducedMotion],
  );

  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-black-500 text-white">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              {slide.type === "image" ? (
                // next/image optimizes still media; videos stay native for autoplay support.
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  onError={() => handleMediaError(index)}
                />
              ) : (
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  src={slide.src}
                  autoPlay={isActive && !prefersReducedMotion}
                  muted
                  playsInline
                  preload={isActive ? "auto" : "metadata"}
                  className="h-full w-full object-cover"
                  onEnded={() => handleVideoEnded(index)}
                  onError={() => handleMediaError(index)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(0,31,73,0.76)_0%,rgba(2,4,10,0.48)_45%,rgba(5,8,13,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(84,134,200,0.22),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.64),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-6xl flex-col items-center justify-center px-6 py-20 text-center sm:px-8 lg:px-12">
        <Image
          src="/logos/logo-with-text.svg"
          alt="MUAS Logo"
          width={260}
          height={74}
          priority
          className="h-auto w-[190px] sm:w-[240px] lg:w-[280px]"
        />

        <p className="mt-8 text-[clamp(2.4rem,7vw,5.6rem)] font-medium leading-[0.95] tracking-[-0.05em] text-white">
          Redefining Drone Technology
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/our-drones"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            Explore Our Drones
          </Link>
          <Link
            href="/recruitment"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/28 bg-white/[0.06] px-6 text-b1 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            Join The Team
          </Link>
        </div>
      </div>
    </section>
  );
}
