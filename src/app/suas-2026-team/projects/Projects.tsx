"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  useSearchNavigation,
  useSearchRevealController,
} from "@/global-components/search/search-navigation-provider";
import { useCarouselAutoplay } from "@/lib/use-carousel-autoplay";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { ProjectInfoPanel } from "./project-info";
import { placeholderImage, projects, type Project } from "./project-data";

const AUTOPLAY_INTERVAL_MS = 4800;
const CARD_TRANSITION_DURATION_MS = 700;
const SLIDE_GAP_PX = 24;
const SWIPE_THRESHOLD_PX = 48;
const SEARCH_CONTROLLER_ID = "redback-projects-carousel";
const MIN_SCROLLBAR_THUMB_HEIGHT_PX = 48;
const SCROLLBAR_TRACK_VERTICAL_INSET_PX = 32;

const LIFELINE_INDEX = projects.findIndex(
  (project) => project.slug === "lifeline",
);

const INITIAL_PROJECT_INDEX = LIFELINE_INDEX >= 0 ? LIFELINE_INDEX : 0;

const UPPER_MANAGEMENT_PROJECT = projects.find(
  (project) =>
    project.slug === "upper-management" ||
    project.name.trim().toLowerCase() === "upper management",
);

const REFERENCE_CARD_SLUG =
  UPPER_MANAGEMENT_PROJECT?.slug ?? projects[0]?.slug ?? "";

type ScrollbarState = {
  isMeasured: boolean;
  isOverflowing: boolean;
  thumbHeight: number;
  thumbTop: number;
};

export function Projects() {
  return (
    <section
      id="our-redback-projects"
      className="scroll-mt-10 bg-[linear-gradient(180deg,#02040a_0%,#001126_46%,#02040a_100%)] py-20 text-white sm:py-24 lg:py-28"
      aria-labelledby="redback-projects-heading"
    >
      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto w-full text-center">
          <h2
            id="redback-projects-heading"
            className="whitespace-nowrap text-[clamp(1.15rem,6.5vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white sm:text-[clamp(2.2rem,5vw,4.8rem)]"
          >
            The Teams Behind Redback
          </h2>
        </div>

        <div className="mt-12 lg:mt-16">
          <RedbackTeamsCarousel />
        </div>
      </div>
    </section>
  );
}

function RedbackTeamsCarousel() {
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(INITIAL_PROJECT_INDEX, projects.length),
  );

  const [isPaused, setIsPaused] = useState(false);
  const [isCardTransitioning, setIsCardTransitioning] = useState(false);

  const [referenceCardHeight, setReferenceCardHeight] = useState<
    number | undefined
  >(undefined);

  const dragStartXRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { registerSearchTarget } = useSearchNavigation();

  const maxIndex = Math.max(projects.length - 1, 0);

  const slideOffset = `calc(-${activeIndex * 100}% - ${
    activeIndex * SLIDE_GAP_PX
  }px)`;

  const clearTransitionTimeout = useCallback(() => {
    if (transitionTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(transitionTimeoutRef.current);
    transitionTimeoutRef.current = null;
  }, []);

  const recordReferenceCardHeight = useCallback(
    (slug: string, height: number) => {
      if (
        slug !== REFERENCE_CARD_SLUG ||
        !Number.isFinite(height) ||
        height <= 0
      ) {
        return;
      }

      const roundedHeight = Math.ceil(height);

      setReferenceCardHeight((currentHeight) =>
        currentHeight === roundedHeight ? currentHeight : roundedHeight,
      );
    },
    [],
  );

  const navigateToSlide = useCallback(
    (nextIndex: number) => {
      if (projects.length === 0) {
        return;
      }

      const normalizedIndex =
        nextIndex < 0 ? maxIndex : nextIndex > maxIndex ? 0 : nextIndex;

      if (normalizedIndex === activeIndex) {
        return;
      }

      clearTransitionTimeout();
      setActiveIndex(normalizedIndex);

      if (prefersReducedMotion) {
        setIsCardTransitioning(false);
        return;
      }

      setIsCardTransitioning(true);

      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsCardTransitioning(false);
        transitionTimeoutRef.current = null;
      }, CARD_TRANSITION_DURATION_MS);
    },
    [
      activeIndex,
      clearTransitionTimeout,
      maxIndex,
      prefersReducedMotion,
    ],
  );

  useSearchRevealController(
    SEARCH_CONTROLLER_ID,
    useMemo(
      () => ({
        reveal: (state) => {
          const carouselInteraction = state.interactions?.find(
            (interaction) =>
              interaction.type === "carousel" &&
              interaction.groupId === SEARCH_CONTROLLER_ID,
          );

          if (
            !carouselInteraction &&
            state.carousel?.id !== SEARCH_CONTROLLER_ID
          ) {
            return;
          }

          const requestedSlideId =
            carouselInteraction?.value ?? state.carousel?.slideId;

          const nextIndex = projects.findIndex(
            (project) => project.slug === requestedSlideId,
          );

          if (nextIndex < 0) {
            return;
          }

          if (transitionTimeoutRef.current !== null) {
            window.clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
          }

          setIsCardTransitioning(false);
          setActiveIndex(nextIndex);
        },
      }),
      [],
    ),
  );

  useEffect(() => {
    return () => {
      clearTransitionTimeout();
    };
  }, [clearTransitionTimeout]);

  useEffect(() => {
    if (!prefersReducedMotion) {
      return;
    }

    clearTransitionTimeout();
    setIsCardTransitioning(false);
  }, [clearTransitionTimeout, prefersReducedMotion]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const activeProject = projects[activeIndex];

    if (!carousel || !activeProject) {
      return;
    }

    const slideElement = carousel.querySelector<HTMLElement>(
      `[data-search-slide-key="${activeProject.slug}"]`,
    );

    if (!slideElement) {
      return;
    }

    const cleanups: Array<() => void> = [
      registerSearchTarget(`redback-project-${activeProject.slug}`, {
        element: slideElement,
        highlightMode: "component",
      }),
    ];

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
  }, [activeIndex, registerSearchTarget]);

  useEffect(() => {
    const activeProject = projects[activeIndex];

    if (!activeProject) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      const activeCardScroller =
        carouselRef.current?.querySelector<HTMLElement>(
          `[data-project-card-scroll="${activeProject.slug}"]`,
        );

      if (!activeCardScroller) {
        return;
      }

      activeCardScroller.scrollTo({
        top: 0,
        behavior: "auto",
      });

      activeCardScroller.dispatchEvent(new Event("scroll"));
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeIndex]);

  const goToNextSlide = useCallback(() => {
    navigateToSlide(activeIndex + 1);
  }, [activeIndex, navigateToSlide]);

  useCarouselAutoplay({
    enabled: true,
    intervalMs: AUTOPLAY_INTERVAL_MS,
    activeIndex,
    maxIndex,
    prefersReducedMotion,
    isInteractionPaused: isPaused,
    containerRef: carouselRef,
    onAdvance: goToNextSlide,
  });

  const goToPreviousSlide = () => {
    navigateToSlide(activeIndex - 1);
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

  const handlePointerCancel = () => {
    dragStartXRef.current = null;
    setIsPaused(false);
  };

  return (
    <div
      ref={carouselRef}
      className="w-full"
      role="region"
      aria-labelledby="redback-projects-heading"
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
          onPointerCancel={handlePointerCancel}
        >
          <div
            className="flex touch-pan-y rounded-[1.5rem] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              gap: `${SLIDE_GAP_PX}px`,
              transform: `translate3d(${slideOffset}, 0, 0)`,
            }}
          >
            {projects.map((project) => (
              <div
                key={project.slug}
                className="shrink-0 basis-full overflow-hidden rounded-[1.5rem]"
              >
                <ProjectImagePanel project={project} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={goToPreviousSlide}
          className="absolute left-0 top-[140px] z-20 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:top-[190px] sm:h-12 sm:w-12 lg:top-[260px]"
          aria-label="Show previous team"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={goToNextSlide}
          className="absolute right-0 top-[140px] z-20 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:top-[190px] sm:h-12 sm:w-12 lg:top-[260px]"
          aria-label="Show next team"
        >
          ›
        </button>

        <div className="mt-5 flex h-3 justify-center gap-2 sm:mt-6">
          {projects.map((project, pageIndex) => {
            const isActive = pageIndex === activeIndex;

            return (
              <button
                key={project.slug}
                type="button"
                onClick={() => navigateToSlide(pageIndex)}
                className={`h-2.5 cursor-pointer rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none ${
                  isActive ? "w-9 bg-blue-50" : "w-2.5 bg-white/25"
                }`}
                aria-label={`View ${project.name} team`}
                aria-current={isActive ? "true" : undefined}
              />
            );
          })}
        </div>

        <div
          className="mt-6 overflow-hidden rounded-[1.5rem]"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div
            className="flex touch-pan-y transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              gap: `${SLIDE_GAP_PX}px`,
              transform: `translate3d(${slideOffset}, 0, 0)`,
            }}
          >
            {projects.map((project, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  key={project.slug}
                  data-search-target-id={`redback-project-${project.slug}`}
                  data-search-managed="true"
                  data-search-slide-key={project.slug}
                  aria-hidden={isActive ? undefined : true}
                  inert={isActive ? undefined : true}
                  className="shrink-0 basis-full rounded-[1.5rem]"
                >
                  <ScrollableProjectCard
                    project={project}
                    isActive={isActive}
                    isCarouselTransitioning={isCardTransitioning}
                    referenceCardHeight={referenceCardHeight}
                    onMeasuredHeight={recordReferenceCardHeight}
                  />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

type ScrollableProjectCardProps = {
  project: Project;
  isActive: boolean;
  isCarouselTransitioning: boolean;
  referenceCardHeight?: number;
  onMeasuredHeight: (slug: string, height: number) => void;
};

function ScrollableProjectCard({
  project,
  isActive,
  isCarouselTransitioning,
  referenceCardHeight,
  onMeasuredHeight,
}: ScrollableProjectCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [scrollbarState, setScrollbarState] = useState<ScrollbarState>({
    isMeasured: false,
    isOverflowing: false,
    thumbHeight: MIN_SCROLLBAR_THUMB_HEIGHT_PX,
    thumbTop: 0,
  });

  const hideScrollbar = useCallback(() => {
    setScrollbarState((currentState) =>
      currentState.isMeasured ||
      currentState.isOverflowing ||
      currentState.thumbTop !== 0
        ? {
            isMeasured: false,
            isOverflowing: false,
            thumbHeight: MIN_SCROLLBAR_THUMB_HEIGHT_PX,
            thumbTop: 0,
          }
        : currentState,
    );
  }, []);

  const updateScrollbar = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer || !isActive) {
      hideScrollbar();
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = scrollContainer;

    const trackHeight = Math.max(
      clientHeight - SCROLLBAR_TRACK_VERTICAL_INSET_PX,
      0,
    );

    if (trackHeight <= 0) {
      hideScrollbar();
      return;
    }

    const maximumScrollTop = Math.max(scrollHeight - clientHeight, 0);

    if (maximumScrollTop === 0) {
      setScrollbarState({
        isMeasured: true,
        isOverflowing: false,
        thumbHeight: trackHeight,
        thumbTop: 0,
      });

      return;
    }

    const proportionalThumbHeight =
      trackHeight * (clientHeight / scrollHeight);

    const thumbHeight = Math.min(
      trackHeight,
      Math.max(MIN_SCROLLBAR_THUMB_HEIGHT_PX, proportionalThumbHeight),
    );

    const maximumThumbTop = Math.max(trackHeight - thumbHeight, 0);

    const thumbTop =
      maximumScrollTop > 0
        ? (scrollTop / maximumScrollTop) * maximumThumbTop
        : 0;

    setScrollbarState((currentState) => {
      const nextThumbHeight = Math.round(thumbHeight);
      const nextThumbTop = Math.round(thumbTop);

      if (
        currentState.isMeasured &&
        currentState.isOverflowing &&
        currentState.thumbHeight === nextThumbHeight &&
        currentState.thumbTop === nextThumbTop
      ) {
        return currentState;
      }

      return {
        isMeasured: true,
        isOverflowing: true,
        thumbHeight: nextThumbHeight,
        thumbTop: nextThumbTop,
      };
    });
  }, [hideScrollbar, isActive]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const contentElement =
      scrollContainer.firstElementChild instanceof HTMLElement
        ? scrollContainer.firstElementChild
        : null;

    const frameId = window.requestAnimationFrame(updateScrollbar);

    scrollContainer.addEventListener("scroll", updateScrollbar, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollbar);

    resizeObserver.observe(scrollContainer);

    if (contentElement) {
      resizeObserver.observe(contentElement);
    }

    void document.fonts?.ready.then(updateScrollbar);

    return () => {
      window.cancelAnimationFrame(frameId);
      scrollContainer.removeEventListener("scroll", updateScrollbar);
      resizeObserver.disconnect();
    };
  }, [project.slug, referenceCardHeight, updateScrollbar]);

  useEffect(() => {
    if (!isActive) {
      hideScrollbar();
      return;
    }

    hideScrollbar();

    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollTo({
      top: 0,
      behavior: "auto",
    });

    const frameId = window.requestAnimationFrame(updateScrollbar);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [hideScrollbar, isActive, updateScrollbar]);

  const shouldShowScrollbar =
    isActive &&
    !isCarouselTransitioning &&
    scrollbarState.isMeasured &&
    scrollbarState.isOverflowing;

  return (
    <div
      className="relative overflow-hidden rounded-[1.5rem]"
      style={
        referenceCardHeight
          ? {
              height: `${referenceCardHeight}px`,
            }
          : undefined
      }
    >
      <div
        ref={scrollContainerRef}
        data-project-card-scroll={project.slug}
        tabIndex={isActive ? 0 : -1}
        aria-label={`${project.name} team information`}
        className="h-full overflow-x-hidden overflow-y-scroll overscroll-contain rounded-[1.5rem] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60 [&::-webkit-scrollbar]:hidden"
      >
        <div className="pr-4">
          <ProjectInfoPanel
            project={project}
            sharedCardHeight={undefined}
            onMeasuredHeight={onMeasuredHeight}
          />
        </div>
      </div>

      {shouldShowScrollbar ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-2 top-4 z-20 w-2 rounded-full border border-white/25 bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.08)]"
        >
          <div
            className="absolute left-0 right-0 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-[height,transform] duration-150 ease-out motion-reduce:transition-none"
            style={{
              height: `${scrollbarState.thumbHeight}px`,
              transform: `translate3d(0, ${scrollbarState.thumbTop}px, 0)`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function ProjectImagePanel({ project }: { project: Project }) {
  const image = project.images[0];

  return (
    <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] bg-blue-950 sm:h-[380px] lg:h-[520px]">
      {image ? (
        <Image
          alt={`${project.name} team`}
          src={image}
          fill
          sizes="(min-width: 1024px) 78vw, 100vw"
          className="rounded-[inherit] object-cover"
          draggable={false}
          style={{
            objectPosition: project.imagePosition ?? "50% 50%",
          }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center p-8 text-center"
          style={{ background: placeholderImage }}
        >
          <p className="max-w-sm text-b1 text-blue-50/80 sm:text-subtitle">
            {project.name} images coming soon
          </p>
        </div>
      )}

      <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,31,73,0.4)_44%,rgba(0,0,0,0.72))]" />
    </div>
  );
}

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), length - 1);
}