"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { SingleWindowCarousel } from "@/global-components/modules/single-window-carousel";
import { ProjectInfoPanel } from "./project-info";
import { placeholderImage, projects } from "./project-data";

const LIFELINE_INDEX = projects.findIndex((project) => project.slug === "lifeline");
const INITIAL_PROJECT_INDEX = LIFELINE_INDEX >= 0 ? LIFELINE_INDEX : 0;

// Projects renders the Redback project carousel using the shared single-window shell.
export function Projects() {
  const [activeIndex, setActiveIndex] = useState(INITIAL_PROJECT_INDEX);
  const activeProject = projects[activeIndex] ?? projects[0];

  const handleActiveIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const slides = useMemo(
    () =>
      projects.map((project) => ({
        key: project.slug,
        content: <ProjectSlide project={project} />,
      })),
    [],
  );

  return (
    <section
      id="our-redback-projects"
      className="scroll-mt-10 bg-[linear-gradient(180deg,#02040a_0%,#001126_46%,#02040a_100%)] py-20 text-white sm:py-24 lg:py-28"
      aria-labelledby="redback-projects-heading"
    >
      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="redback-projects-heading"
            className="text-[clamp(2.6rem,5vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white"
          >
            Our Redback Projects
          </h2>
          <p className="mt-5 text-b1 leading-relaxed text-blue-50/75 sm:text-subtitle">
            Explore the subsystems that bring Redback from concept to flight.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(22rem,0.55fr)] lg:items-stretch lg:gap-12">
          <div className="min-w-0">
            <SingleWindowCarousel
              slides={slides}
              labelledBy="redback-projects-heading"
              previousLabel="Show previous project"
              nextLabel="Show next project"
              getDotLabel={(pageIndex) =>
                `Show ${projects[pageIndex]?.name ?? `project ${pageIndex + 1}`}`
              }
              initialIndex={INITIAL_PROJECT_INDEX}
              onActiveIndexChange={handleActiveIndexChange}
            />
          </div>

          <ProjectInfoPanel project={activeProject} />
        </div>
      </div>
    </section>
  );
}

type ProjectSlideProps = {
  project: (typeof projects)[number];
};

function ProjectSlide({ project }: ProjectSlideProps) {
  const image = project.images[0];

  return (
    <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-blue-950 sm:min-h-[440px] lg:min-h-[580px]">
      {image ? (
        <Image
          alt={`${project.name} project`}
          src={image}
          fill
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="rounded-[inherit] object-cover"
          draggable={false}
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
