"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const AUTOPLAY_INTERVAL_MS = 4800;
const CAROUSEL_TRANSITION_MS = 700;
const SLIDE_GAP_PX = 24;
const SWIPE_THRESHOLD_PX = 48;

export type SingleWindowCarouselSlide = {
  key: string;
  content: ReactNode;
};

type SingleWindowCarouselProps = {
  slides: SingleWindowCarouselSlide[];
  labelledBy: string;
  previousLabel?: string;
  nextLabel?: string;
  getDotLabel?: (index: number) => string;
  autoplay?: boolean;
  initialIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  dotTone?: "light" | "blue";
};

// Dependency-free single-window carousel shared by homepage and Redback projects.
export function SingleWindowCarousel({
  slides,
  labelledBy,
  previousLabel = "Show previous slide",
  nextLabel = "Show next slide",
  getDotLabel = (index) => `Show slide ${index + 1}`,
  autoplay = true,
  initialIndex = 0,
  onActiveIndexChange,
  dotTone = "light",
}: SingleWindowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialIndex, slides.length),
  );
  const [isPaused, setIsPaused] = useState(false);
  const dragStartXRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const hasNotifiedParentRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const maxIndex = Math.max(slides.length - 1, 0);
  const slideOffset = `calc(-${activeIndex * 100}% - ${activeIndex * SLIDE_GAP_PX
    }px)`;
  const pageIndexes = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, index) => index),
    [maxIndex],
  );
  const activeDotClass = dotTone === "blue" ? "w-9 bg-blue-900" : "w-9 bg-blue-50";
  const inactiveDotClass =
    dotTone === "blue" ? "w-2.5 bg-blue-900/25" : "w-2.5 bg-white/25";

  useEffect(() => {
    // Skip the mount notification — the parent already owns the initial index.
    // Syncing during the first commit can race App Router transitions.
    if (!onActiveIndexChange) {
      return;
    }

    if (!hasNotifiedParentRef.current) {
      hasNotifiedParentRef.current = true;
      return;
    }

    onActiveIndexChange(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  const navigateToSlide = useCallback(
    (nextIndex: number) => {
      if (slides.length === 0) {
        return;
      }

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
    [maxIndex, prefersReducedMotion, slides.length],
  );

  useEffect(() => {
    if (!autoplay || prefersReducedMotion || isPaused || maxIndex === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      navigateToSlide(activeIndex + 1);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [
    activeIndex,
    autoplay,
    isPaused,
    maxIndex,
    navigateToSlide,
    prefersReducedMotion,
  ]);

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

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full"
      role="region"
      aria-labelledby={labelledBy}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative px-12 sm:px-16 lg:px-20">
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
            {slides.map((slide) => (
              <div
                key={slide.key}
                className="shrink-0 basis-full overflow-hidden rounded-[1.5rem]"
              >
                {slide.content}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={goToPreviousSlide}
          className="absolute left-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
          aria-label={previousLabel}
        >
          ‹
        </button>

        <button
          type="button"
          onClick={goToNextSlide}
          className="absolute right-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
          aria-label={nextLabel}
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
              className={`h-2.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none ${isActive ? activeDotClass : inactiveDotClass
                }`}
              aria-label={getDotLabel(pageIndex)}
              aria-current={isActive ? "true" : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), length - 1);
}
