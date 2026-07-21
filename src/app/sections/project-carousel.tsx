"use client";

import Image from "next/image";
import { type PointerEvent, useCallback, useMemo, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { SectionProject } from "@/app/sections/section-data";

type ProjectCarouselProps = {
  projects: SectionProject[];
};

const carouselTransitionMs = 700;
const slideGapPx = 24;
const swipeThresholdPx = 48;

// ProjectCarousel follows the homepage carousel pattern for section project slides.
export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
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
      aria-label="Section projects"
      className="mt-10 w-full lg:mt-12"
      role="region"
    >
      <div className="relative px-12 sm:px-16 lg:px-20">
        <div
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
                className="shrink-0 basis-full overflow-hidden rounded-[1.5rem]"
                key={project.name}
              >
                <ProjectSlide
                  index={index}
                  project={project}
                  projectCount={projects.length}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Previous project"
          className="absolute left-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/24 bg-black/36 text-white backdrop-blur transition-colors duration-300 hover:bg-black/52 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
          onClick={goToPreviousSlide}
          type="button"
        >
          <LuChevronLeft aria-hidden className="h-5 w-5" />
        </button>

        <button
          aria-label="Next project"
          className="absolute right-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/24 bg-black/36 text-white backdrop-blur transition-colors duration-300 hover:bg-black/52 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/75 motion-reduce:transition-none sm:h-12 sm:w-12"
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
              aria-label={`Show project slide ${slideIndex + 1}`}
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
  projectCount: number;
};

// ProjectSlide keeps project imagery and copy inside one contained homepage-style card.
function ProjectSlide({ index, project, projectCount }: ProjectSlideProps) {
  return (
    <article className="grid min-h-[34rem] bg-[linear-gradient(155deg,rgba(255,255,255,0.08)_0%,rgba(84,134,200,0.09)_44%,rgba(0,31,73,0.38)_100%)] text-white lg:min-h-[32rem] lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)]">
      <div className="relative min-h-56 overflow-hidden bg-blue-900 sm:min-h-72 lg:min-h-full">
        <Image
          alt={`${project.name} project`}
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
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

      <div className="flex min-h-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-caption font-medium uppercase tracking-[0.18em] text-blue-100/66">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(projectCount).padStart(2, "0")}
        </p>
        <h3 className="mt-5 break-words text-h6 font-medium leading-[0.95] tracking-[-0.05em] text-white sm:text-h5 lg:text-h4">
          {project.name}
        </h3>
        <p className="mt-5 max-w-2xl text-b2 leading-relaxed text-blue-50/78 sm:text-b1">
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
