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
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useSearchNavigation,
  useSearchRevealController,
} from "@/global-components/search/search-navigation-provider";
import { isCircularNear } from "@/lib/is-circular-near";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const AUTOPLAY_INTERVAL_MS = 4800;
const CAROUSEL_TRANSITION_MS = 400;
const SLIDE_GAP_PX = 24;
const SWIPE_THRESHOLD_PX = 48;

export type SingleWindowCarouselSlide = {
  key: string;
  content?: ReactNode;
  renderContent?: (state: {
    isNearActive: boolean;
    isActive: boolean;
  }) => ReactNode;
  searchTargetId?: string;
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
  searchControllerId?: string;
  isPaused?: boolean;
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
  searchControllerId,
  isPaused: externalIsPaused = false,
}: SingleWindowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialIndex, slides.length),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  const dragStartXRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const hasNotifiedParentRef = useRef(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { registerSearchTarget } = useSearchNavigation();

  const maxIndex = Math.max(slides.length - 1, 0);

  const slideOffset = `calc(-${activeIndex * 100}% - ${
    activeIndex * SLIDE_GAP_PX
  }px)`;

  const pageIndexes = useMemo(
    () => Array.from({ length: maxIndex + 1 }, (_, index) => index),
    [maxIndex],
  );

  useSearchRevealController(
    searchControllerId ?? "__single-window-carousel-unregistered",
    useMemo(
      () => ({
        reveal: (state) => {
          const carouselInteraction = state.interactions?.find(
            (interaction) =>
              interaction.type === "carousel" &&
              interaction.groupId === searchControllerId,
          );

          if (
            !searchControllerId ||
            (!carouselInteraction &&
              state.carousel?.id !== searchControllerId)
          ) {
            return;
          }

          const requestedSlideId =
            carouselInteraction?.value ?? state.carousel?.slideId;

          const nextIndex = slides.findIndex(
            (slide) => slide.key === requestedSlideId,
          );

          if (nextIndex < 0) {
            return;
          }

          if (transitionTimeoutRef.current !== null) {
            window.clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
          }

          isTransitioningRef.current = false;
          setActiveIndex(nextIndex);
          onActiveIndexChange?.(nextIndex);
        },
      }),
      [onActiveIndexChange, searchControllerId, slides],
    ),
  );

  useEffect(() => {
    // Skip the mount notification because the parent already owns the
    // initial index. Syncing during the first commit can race App Router
    // transitions.
    if (!onActiveIndexChange) {
      return;
    }

    if (!hasNotifiedParentRef.current) {
      hasNotifiedParentRef.current = true;
      return;
    }

    onActiveIndexChange(activeIndex);
  }, [activeIndex, onActiveIndexChange]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const activeSlide = slides[activeIndex];

    if (!carousel || !activeSlide) {
      return;
    }

    const slideElement = carousel.querySelector<HTMLElement>(
      `[data-search-slide-key="${activeSlide.key}"]`,
    );

    if (!slideElement) {
      return;
    }

    const cleanups: Array<() => void> = [];

    if (activeSlide.searchTargetId) {
      cleanups.push(
        registerSearchTarget(activeSlide.searchTargetId, {
          element: slideElement,
          highlightMode: "component",
        }),
      );
    }

    slideElement
      .querySelectorAll<HTMLElement>("[data-search-target-id]")
      .forEach((element) => {
        const targetId = element.dataset.searchTargetId;

        if (!targetId) {
          return;
        }

        cleanups.push(
          registerSearchTarget(targetId, {
            element,
            highlightMode:
              element.dataset.searchHighlightMode === "text"
                ? "text"
                : "component",
          }),
        );
      });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [activeIndex, registerSearchTarget, slides]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || slides.length === 0) {
      setViewportHeight(null);
      return;
    }

    const activeSlide = viewport.querySelector<HTMLElement>(
      `[data-carousel-slide-index="${activeIndex}"]`,
    );

    if (!activeSlide) {
      setViewportHeight(null);
      return;
    }

    const updateHeight = () => {
      const nextHeight = Math.ceil(activeSlide.getBoundingClientRect().height);

      setViewportHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);

    resizeObserver.observe(activeSlide);
    void document.fonts?.ready.then(updateHeight);

    return () => resizeObserver.disconnect();
  }, [activeIndex, slides.length]);

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

  const goToNextSlide = useCallback(() => {
    navigateToSlide(activeIndex + 1);
  }, [activeIndex, navigateToSlide]);

  const goToPreviousSlide = useCallback(() => {
    navigateToSlide(activeIndex - 1);
  }, [activeIndex, navigateToSlide]);

  useCarouselAutoplay({
    enabled: autoplay,
    intervalMs: AUTOPLAY_INTERVAL_MS,
    activeIndex,
    maxIndex,
    prefersReducedMotion,
    isInteractionPaused: isPaused || externalIsPaused,
    containerRef: carouselRef,
    onAdvance: goToNextSlide,
  });

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

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

  const handlePointerCancel = () => {
    dragStartXRef.current = null;
    setIsPaused(false);
  };

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      ref={carouselRef}
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
          ref={viewportRef}
          className="overflow-hidden rounded-[1.5rem]"
          style={viewportHeight ? { height: `${viewportHeight}px` } : undefined}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className="flex touch-pan-y transform-gpu rounded-[1.5rem] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none"
            style={{
              gap: `${SLIDE_GAP_PX}px`,
              transform: `translate3d(${slideOffset}, 0, 0)`,
              backfaceVisibility: "hidden",
            }}
          >
            {slides.map((slide, index) => {
              const isNearActive = isCircularNear(
                index,
                activeIndex,
                slides.length,
                1,
              );
              const isActive = index === activeIndex;

              const content =
                slide.renderContent?.({
                  isNearActive,
                  isActive,
                }) ?? slide.content;

              return (
                <div
                  key={slide.key}
                  data-search-target-id={slide.searchTargetId}
                  data-search-managed="true"
                  data-search-slide-key={slide.key}
                  data-carousel-slide-index={index}
                  className="shrink-0 basis-full transform-gpu overflow-hidden rounded-[1.5rem]"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={goToPreviousSlide}
          className="absolute left-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
          aria-label={previousLabel}
        >
          <ChevronLeft
            aria-hidden
            className="h-5 w-5"
            strokeWidth={2.7}
          />
        </button>

        <button
          type="button"
          onClick={goToNextSlide}
          className="absolute right-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
          aria-label={nextLabel}
        >
          <ChevronRight
            aria-hidden
            className="h-5 w-5"
            strokeWidth={2.7}
          />
        </button>
      </div>

      <div className="mt-7 flex justify-center gap-2">
        {pageIndexes.map((pageIndex) => {
          const isActive = pageIndex === activeIndex;

          const fillClass =
            dotTone === "blue" ? "bg-blue-900" : "bg-blue-50";

          const trackClass =
            dotTone === "blue" ? "bg-blue-900/25" : "bg-white/25";

          return (
            <button
              key={pageIndex}
              type="button"
              onClick={() => navigateToSlide(pageIndex)}
              className={`relative h-2.5 w-9 cursor-pointer overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${trackClass}`}
              aria-label={getDotLabel(pageIndex)}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 w-full origin-left rounded-full transition-transform duration-300 ease-out motion-reduce:transition-none ${fillClass} ${
                  isActive ? "scale-x-100" : "scale-x-[0.28]"
                }`}
              />
            </button>
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
