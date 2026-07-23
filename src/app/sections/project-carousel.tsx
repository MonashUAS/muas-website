"use client";

import Image from "next/image";
import {
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { SectionProject } from "@/app/sections/section-data";
import {
  useSearchNavigation,
  useSearchRevealController,
} from "@/global-components/search/search-navigation-provider";

type ProjectCarouselProps = {
  projects: SectionProject[];
  sectionSlug: string;
};

const carouselTransitionMs = 700;
const slideGapPx = 24;
const swipeThresholdPx = 48;

// ProjectCarousel follows the homepage carousel pattern for section responsibility slides.
export function ProjectCarousel({ projects, sectionSlug }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const { registerSearchTarget } = useSearchNavigation();
  const slideIndexes = useMemo(
    () => Array.from({ length: projects.length }, (_, index) => index),
    [projects.length],
  );
  const slideOffset = `calc(-${activeIndex * 100}% - ${
    activeIndex * slideGapPx
  }px)`;

  const navigateToSlide = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, projects.length));
    },
    [projects.length],
  );

  useSearchRevealController(
    `${sectionSlug}-projects-carousel`,
    useMemo(
      () => ({
        reveal: (state) => {
          const carouselInteraction = state.interactions?.find(
            (interaction) =>
              interaction.type === "carousel" &&
              interaction.groupId === `${sectionSlug}-projects-carousel`,
          );

          if (
            !carouselInteraction &&
            state.carousel?.id !== `${sectionSlug}-projects-carousel`
          ) {
            return;
          }

          const nextIndex = projects.findIndex(
            (project) =>
              project.slug ===
              (carouselInteraction?.value ?? state.carousel?.slideId),
          );

          if (nextIndex >= 0) {
            setActiveIndex(nextIndex);
          }
        },
      }),
      [projects, sectionSlug],
    ),
  );

  useEffect(() => {
    const carousel = carouselRef.current;
    const activeProject = projects[activeIndex];

    if (!carousel || !activeProject) {
      return;
    }

    const targetIds = [
      {
        id: `${sectionSlug}-project-${activeProject.slug}`,
        mode: "component" as const,
      },
      {
        id: `${sectionSlug}-project-${activeProject.slug}-heading`,
        mode: "text" as const,
      },
      {
        id: `${sectionSlug}-project-${activeProject.slug}-description`,
        mode: "text" as const,
      },
    ];
    const cleanups = targetIds.flatMap(({ id, mode }) => {
      const element = carousel.querySelector<HTMLElement>(
        `[data-search-target-id="${id}"]`,
      );

      return element
        ? [
            registerSearchTarget(id, {
              element,
              highlightMode: mode,
            }),
          ]
        : [];
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [activeIndex, projects, registerSearchTarget, sectionSlug]);

  const goToPreviousSlide = () => {
    navigateToSlide(activeIndex - 1);
  };

  const goToNextSlide = () => {
    navigateToSlide(activeIndex + 1);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const dragStartX = dragStartXRef.current;
    dragStartXRef.current = null;

    if (dragStartX === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX;

    if (Math.abs(dragDistance) < swipeThresholdPx) {
      return;
    }

    if (dragDistance < 0) {
      goToNextSlide();
    } else {
      goToPreviousSlide();
    }
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Section responsibilities"
      className="mt-8 w-full sm:mt-10 lg:mt-12"
      role="region"
    >
      <div className="relative px-10 sm:px-12 lg:px-14">
        <div
          ref={carouselRef}
          className="overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/[0.045]"
          onPointerCancel={() => {
            dragStartXRef.current = null;
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <div
            className="flex touch-pan-y rounded-[1.5rem] transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              gap: `${slideGapPx}px`,
              transform: `translate3d(${slideOffset}, 0, 0)`,
              transitionDuration: `${carouselTransitionMs}ms`,
            }}
          >
            {projects.map((project, index) => (
              <div
                className="h-[min(70svh,36rem)] shrink-0 basis-full overflow-hidden rounded-[1.5rem] sm:h-[min(72svh,38rem)] lg:h-[min(68svh,40rem)]"
                key={project.name}
                data-search-target-id={`${sectionSlug}-project-${project.slug}`}
                data-search-managed="true"
              >
                <ProjectSlide
                  index={index}
                  project={project}
                  sectionSlug={sectionSlug}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Previous responsibility"
          className="absolute left-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
          onClick={goToPreviousSlide}
          type="button"
        >
          <LuChevronLeft aria-hidden className="h-5 w-5" />
        </button>

        <button
          aria-label="Next responsibility"
          className="absolute right-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
          onClick={goToNextSlide}
          type="button"
        >
          <LuChevronRight aria-hidden className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-7 flex justify-center gap-2">
        {slideIndexes.map((slideIndex) => {
          const isActive = slideIndex === activeIndex;

          return (
            <button
              aria-current={isActive ? "true" : undefined}
              aria-label={`Show responsibility slide ${slideIndex + 1}`}
              className={`h-2.5 rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none ${
                isActive ? "w-9 bg-blue-50" : "w-2.5 bg-white/25 hover:bg-white/45"
              }`}
              key={slideIndex}
              onClick={() => navigateToSlide(slideIndex)}
              type="button"
            />
          );
        })}
      </div>
    </div>
  );
}

type ProjectSlideProps = {
  index: number;
  project: SectionProject;
  sectionSlug: string;
};

// ProjectSlide keeps every responsibility inside one fixed-size card layout.
function ProjectSlide({ index, project, sectionSlug }: ProjectSlideProps) {
  return (
    <article className="grid h-full grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)] bg-[linear-gradient(155deg,rgba(255,255,255,0.08)_0%,rgba(84,134,200,0.09)_44%,rgba(0,31,73,0.38)_100%)] text-white lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] lg:grid-rows-none">
      <div className="relative min-h-0 overflow-hidden bg-blue-900">
        <Image
          alt={`${project.name} responsibility`}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          decoding="async"
          draggable={false}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 46vw, 100vw"
          src={project.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.46)_100%)]" />
        <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />
        <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
      </div>

      <div className="flex min-h-0 flex-col justify-center overflow-hidden p-6 sm:p-8 lg:p-10">
        <h3 className="shrink-0 break-words text-h6 font-medium leading-[0.95] tracking-[-0.05em] text-white sm:text-h5 lg:text-h4">
          <span
            data-search-target-id={`${sectionSlug}-project-${project.slug}-heading`}
            data-search-managed="true"
            data-search-highlight-mode="text"
          >
            {project.name}
          </span>
        </h3>
        <p
          data-search-target-id={`${sectionSlug}-project-${project.slug}-description`}
          data-search-managed="true"
          data-search-highlight-mode="text"
          className="mt-5 min-h-0 overflow-hidden text-b2 leading-relaxed text-blue-50/78 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6] sm:text-b1 sm:[-webkit-line-clamp:8] lg:[-webkit-line-clamp:12]"
        >
          {project.description}
        </p>
      </div>
    </article>
  );
}

// wrapIndex loops carousel indices around the available project range.
function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}
