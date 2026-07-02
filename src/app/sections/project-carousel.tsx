"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import type { SectionProject } from "@/app/sections/section-data";
import { useWheelNavigation } from "@/app/our-drones/useWheelNavigation";

type ProjectCarouselProps = {
  projects: SectionProject[];
};

// ProjectCarousel presents section projects with centred focus, side previews, and wheel navigation.
export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // moveCarousel advances the active project while wrapping at either end.
  const moveCarousel = useCallback(
    (direction: number) => {
      setActiveIndex((current) => wrapIndex(current + direction, projects.length));
    },
    [projects.length],
  );

  useWheelNavigation(carouselRef, {
    cooldownMs: 420,
    onStep: moveCarousel,
    threshold: 8,
  });

  return (
    <div
      ref={carouselRef}
      aria-label="Section projects"
      className="relative mx-auto mt-10 flex h-[30rem] w-full max-w-7xl items-center justify-center overflow-hidden sm:h-[34rem]"
    >
      {projects.map((project, index) => {
        const offset = getShortestOffset(index, activeIndex, projects.length);
        const isActive = offset === 0;

        return (
          <button
            aria-label={`Show ${project.name} project`}
            className={`absolute flex w-[70vw] max-w-2xl min-w-64 ${isActive ? 'cursor-default' : 'cursor-pointer'} flex-col text-left text-white transition-all duration-500 ease-out`}
            key={project.name}
            onClick={() => setActiveIndex(index)}
            style={{
              opacity: isActive ? 1 : 0.38,
              transform: `translateX(${offset * 88}%) scale(${isActive ? 1 : 0.82})`,
              zIndex: isActive ? 2 : 1,
            }}
            type="button"
          >
            <Image
              alt={`${project.name} project`}
              className="aspect-[16/9] w-full object-cover"
              draggable={false}
              height={576}
              src={project.image}
              width={1024}
            />
            <span className="mt-5 block text-h6 font-black uppercase underline decoration-white underline-offset-8 leading-tight">
              {project.name}
            </span>
            <span className="mt-5 block max-w-2xl text-b2 leading-relaxed text-blue-50">
              {project.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// wrapIndex keeps carousel indices inside the available project range.
function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

// getShortestOffset positions projects around the active carousel item.
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
