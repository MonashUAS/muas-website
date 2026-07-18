"use client";

import {
  type CSSProperties,
  useCallback,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { SectionProject } from "@/app/sections/section-data";

type ProjectCarouselProps = {
  projects: SectionProject[];
};

// ProjectCarousel presents section projects as an infinite horizontal carousel.
export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];
  const visibleProjects = useMemo(
    () => getVisibleProjects(projects, activeIndex),
    [activeIndex, projects],
  );

  // navigateTo wraps project selection at either end for an infinite-wheel feel.
  const navigateTo = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, projects.length));
    },
    [projects.length],
  );

  // moveCarousel advances the active project while wrapping around the project list.
  const moveCarousel = useCallback(
    (direction: number) => {
      setActiveIndex((current) => wrapIndex(current + direction, projects.length));
    },
    [projects.length],
  );

  return (
    <div
      aria-label="Section projects"
      className="relative mt-8 overflow-clip py-4 sm:mt-10 lg:mt-12"
    >
      <div className="relative h-[50rem] sm:h-[40rem] lg:h-[35rem]">
        {visibleProjects.map(({ index, offset, project }) => {
          const isActive = offset === 0;

          return (
            <button
              aria-label={`Show ${project.name} project`}
              aria-pressed={isActive}
              className={`absolute left-1/2 top-1/2 min-w-0 overflow-hidden border text-left shadow-[0_28px_80px_rgba(0,0,0,0.3)] backdrop-blur-md transition-[opacity,transform,border-color,background-color] duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none ${
                isActive
                  ? "cursor-default border-blue-100/28 bg-white/[0.09] text-white"
                  : "cursor-pointer border-white/10 bg-white/[0.045] text-blue-50/72 hover:border-white/22 hover:bg-white/[0.075] hover:text-white"
              }`}
              key={`${project.name}-${offset}`}
              onClick={() => navigateTo(index)}
              style={getProjectCardStyle(offset, isActive)}
              type="button"
            >
              {isActive ? (
                <ActiveProjectCard
                  activeIndex={activeIndex}
                  project={activeProject}
                  projectCount={projects.length}
                />
              ) : (
                <ProjectPreviewCard
                  index={index}
                  project={project}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative z-20 mx-auto mt-3 flex w-full max-w-6xl items-center justify-between gap-4 px-1 sm:mt-5">
        <div className="min-w-0 text-b2 text-blue-50/58 sm:text-b1">
          <span className="text-white">{activeProject.name}</span>
          <span className="px-2 text-blue-100/34">/</span>
          {String(activeIndex + 1).padStart(2, "0")} of{" "}
          {String(projects.length).padStart(2, "0")}
        </div>

        <div className="flex shrink-0 gap-3">
          <button
            aria-label="Previous project"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/[0.08] text-white transition-colors duration-300 hover:border-white/28 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
            onClick={() => moveCarousel(-1)}
            type="button"
          >
            <LuChevronLeft aria-hidden className="h-5 w-5" />
          </button>
          <button
            aria-label="Next project"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/16 bg-white/[0.08] text-white transition-colors duration-300 hover:border-white/28 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
            onClick={() => moveCarousel(1)}
            type="button"
          >
            <LuChevronRight aria-hidden className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ActiveProjectCard renders the focused project with full image and description.
function ActiveProjectCard({
  activeIndex,
  project,
  projectCount,
}: {
  activeIndex: number;
  project: SectionProject;
  projectCount: number;
}) {
  return (
    <article className="grid min-h-[40rem] sm:min-h-[34rem] lg:min-h-[30rem] lg:grid-cols-[minmax(0,0.58fr)_minmax(300px,0.42fr)]">
      <div className="relative min-h-36 overflow-hidden bg-blue-900 sm:min-h-72 lg:min-h-0">
        <Image
          alt={`${project.name} project`}
          className="object-cover"
          draggable={false}
          fill
          priority={activeIndex === 0}
          sizes="(min-width: 1024px) 45vw, 86vw"
          src={project.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.5)_100%)]" />
        <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />
        <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
      </div>

      <div className="flex min-h-0 flex-col justify-between p-5 sm:p-7 lg:p-8">
        <div>
          <p className="text-caption font-medium uppercase tracking-[0.2em] text-blue-100/62">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projectCount).padStart(2, "0")}
          </p>
          <h3 className="mt-4 break-words text-h6 font-medium leading-tight text-white sm:mt-5 sm:text-h5">
            {project.name}
          </h3>
          <p className="mt-4 text-b2 leading-relaxed text-blue-50/78 sm:text-b1">
            {project.description}
          </p>
        </div>
      </div>
    </article>
  );
}

// ProjectPreviewCard renders an adjacent project preview in the horizontal row.
function ProjectPreviewCard({
  index,
  project,
}: {
  index: number;
  project: SectionProject;
}) {
  return (
    <article className="flex h-full flex-col">
      <div className="relative h-44 overflow-hidden bg-blue-900 sm:h-56">
        <Image
          alt={`${project.name} project preview`}
          className="object-cover"
          draggable={false}
          fill
          sizes="(min-width: 1024px) 22vw, 68vw"
          src={project.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.56)_100%)]" />
      </div>

      <div className="flex flex-1 flex-col justify-end p-4 sm:p-5">
        <p className="text-caption font-medium uppercase tracking-[0.2em] text-blue-100/52">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 break-words text-b1 font-medium leading-tight sm:text-subtitle">
          {project.name}
        </h3>
      </div>
    </article>
  );
}

// getProjectCardStyle positions the active project with one wrapped neighbour on each side.
function getProjectCardStyle(
  offset: number,
  isActive: boolean,
) {
  const distance = isActive ? 0 : offset * 32;
  const scale = isActive ? 1 : Math.max(0.76, 0.88 - Math.abs(offset) * 0.06);

  return {
    height: isActive ? "auto" : "22rem",
    opacity: isActive ? 1 : 0.52,
    transform: `translate(calc(-50% + ${distance}rem), -50%) scale(${scale})`,
    width: isActive ? "min(90vw, 58rem)" : "min(66vw, 22rem)",
    zIndex: 2 - Math.abs(offset),
  } as CSSProperties;
}

// getVisibleProjects returns the active project plus its wrapped neighbours.
function getVisibleProjects(projects: SectionProject[], activeIndex: number) {
  return [-1, 0, 1].map((offset) => {
    const index = wrapIndex(activeIndex + offset, projects.length);

    return {
      index,
      offset,
      project: projects[index],
    };
  });
}

// wrapIndex loops carousel indices around the available project range.
function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}
