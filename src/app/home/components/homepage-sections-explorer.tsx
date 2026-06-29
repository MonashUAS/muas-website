"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { homepageSections } from "../data/sections";
import { usePrefersReducedMotion } from "../utils/use-prefers-reduced-motion";

const AUTOPLAY_INTERVAL_MS = 4800;
const CAROUSEL_TRANSITION_MS = 700;
const SLIDE_GAP_PX = 24;
const SWIPE_THRESHOLD_PX = 48;

// A dependency-free single-window carousel for the homepage team gallery.
// Placeholder image paths are maintained in sections.ts.
export function HomepageSectionsExplorer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const maxIndex = homepageSections.length - 1;
  const slideOffset = `calc(-${activeIndex * 100}% - ${
    activeIndex * SLIDE_GAP_PX
  }px)`;
  const pageIndexes = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, index) => index),
    [maxIndex],
  );

  const navigateToSlide = useCallback(
    (nextIndex: number) => {
      if (isTransitioningRef.current && !prefersReducedMotion) {
        return;
      }

      const normalizedIndex =
        nextIndex < 0 ? maxIndex : nextIndex > maxIndex ? 0 : nextIndex;

      setActiveIndex(normalizedIndex);

      if (prefersReducedMotion) {
        return;
      }

      isTransitioningRef.current = true;

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        isTransitioningRef.current = false;
        transitionTimeoutRef.current = null;
      }, CAROUSEL_TRANSITION_MS);
    },
    [maxIndex, prefersReducedMotion],
  );

  useEffect(() => {
    if (prefersReducedMotion || isPaused || maxIndex === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      navigateToSlide(activeIndex + 1);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [activeIndex, isPaused, maxIndex, navigateToSlide, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const goToPreviousSlide = () => {
    navigateToSlide(activeIndex - 1);
  };

  const goToNextSlide = () => {
    navigateToSlide(activeIndex + 1);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = event.clientX;
    setIsPaused(true);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const dragStartX = dragStartXRef.current;
    dragStartXRef.current = null;
    setIsPaused(false);

    if (dragStartX === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX;

    if (Math.abs(dragDistance) < SWIPE_THRESHOLD_PX) {
      return;
    }

    if (dragDistance < 0) {
      goToNextSlide();
    } else {
      goToPreviousSlide();
    }
  };

  return (
    <section
      className="bg-[linear-gradient(180deg,#02040a_0%,#001f49_46%,#02040a_100%)] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      aria-labelledby="homepage-sections-heading"
    >
      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <h2
              id="homepage-sections-heading"
              className="text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-white"
            >
              Explore Our Sections
            </h2>

            <p className="mt-7 max-w-xl text-b1 leading-7 text-blue-50/75 sm:text-subtitle">
              From aircraft structures to flight operations, every MUAS section
              plays a role in taking our systems from concept to competition.
            </p>
          </div>

          <div
            className="w-full"
            role="region"
            aria-labelledby="homepage-sections-heading"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div className="relative">
              <div
                className="overflow-hidden rounded-[1.5rem]"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  dragStartXRef.current = null;
                  setIsPaused(false);
                }}
              >
                <div
                  className="flex touch-pan-y rounded-[1.5rem] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                  style={{
                    gap: `${SLIDE_GAP_PX}px`,
                    transform: `translate3d(${slideOffset}, 0, 0)`,
                  }}
                >
                  {homepageSections.map((section) => (
                    <div
                      key={section.href}
                      className="shrink-0 basis-full overflow-hidden rounded-[1.5rem]"
                    >
                      <SectionTile section={section} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={goToPreviousSlide}
                className="absolute left-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/24 bg-black/36 text-2xl text-white backdrop-blur transition-colors duration-300 hover:bg-black/52 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:left-5 sm:h-12 sm:w-12"
                aria-label="Show previous section"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goToNextSlide}
                className="absolute right-2 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/24 bg-black/36 text-2xl text-white backdrop-blur transition-colors duration-300 hover:bg-black/52 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:right-5 sm:h-12 sm:w-12"
                aria-label="Show next section"
              >
                ›
              </button>
            </div>

            <div className="mt-7 flex justify-center gap-2">
              {pageIndexes.map((pageIndex) => {
                const isActive = pageIndex === activeIndex;

                return (
                  <button
                    key={pageIndex}
                    type="button"
                    onClick={() => navigateToSlide(pageIndex)}
                    className={`h-2.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none ${
                      isActive ? "w-9 bg-blue-50" : "w-2.5 bg-white/25"
                    }`}
                    aria-label={`Show section slide ${pageIndex + 1}`}
                    aria-current={isActive ? "true" : undefined}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type SectionTileProps = {
  section: (typeof homepageSections)[number];
};

function SectionTile({ section }: SectionTileProps) {
  return (
    <Link
      href={section.href}
      className="group relative block h-[360px] overflow-hidden rounded-[1.5rem] bg-blue-950 text-white outline-none transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-2xl hover:shadow-blue-950/18 focus-visible:ring-2 focus-visible:ring-blue-800/55 motion-reduce:transition-none sm:h-[430px] lg:h-[560px]"
    >
      <Image
        src={section.image}
        alt={section.alt}
        fill
        sizes="(min-width: 1024px) 54vw, 100vw"
        className="rounded-[inherit] object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-focus-visible:scale-[1.045] motion-reduce:transition-none"
      />

      <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,31,73,0.4)_44%,rgba(0,0,0,0.88))]" />
      <div className="absolute inset-0 rounded-[inherit] bg-blue-500/0 transition-colors duration-500 group-hover:bg-blue-500/[0.08] group-focus-visible:bg-blue-500/[0.08] motion-reduce:transition-none" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
        <div className="max-w-xl">
          <h3 className="text-[clamp(2.3rem,4.4vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.05em]">
            {section.title}
          </h3>

          <p className="mt-4 max-w-md text-b1 leading-6 text-blue-50/82 sm:text-subtitle">
            {section.description}
          </p>

          <span className="mt-6 inline-flex items-center gap-3 text-b2 font-medium uppercase tracking-[0.18em] text-blue-50/84 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white motion-reduce:transition-none">
            Visit section
            <span
              className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
