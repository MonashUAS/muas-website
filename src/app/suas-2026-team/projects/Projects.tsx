"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { ProjectCard } from "./project-card";
import { projects } from "./project-data";

const IMAGE_ROTATION_MS = 5000;

// Projects renders the Redback project carousel and owns project/image navigation state.
export function Projects() {
  const [projectIndex, setProjectIndex] = useState(4);
  const [imageIndex, setImageIndex] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [hoverSide, setHoverSide] = useState<"left" | "right">("right");
  const activeProject = projects[projectIndex];

  // This effect auto-rotates project images every five seconds while the info panel is closed.
  useEffect(() => {
    if (infoOpen || activeProject.images.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setImageIndex((current) => wrapIndex(current + 1, activeProject.images.length));
    }, IMAGE_ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [activeProject.images.length, infoOpen, projectIndex]);

  // moveProject changes the active project and resets panel/image state for a clean transition.
  function moveProject(step: number) {
    setProjectIndex((current) => wrapIndex(current + step, projects.length));
    setImageIndex(0);
    setInfoOpen(false);
  }

  // selectProject jumps to a dot-selected project and resets transient carousel state.
  function selectProject(index: number) {
    setProjectIndex(index);
    setImageIndex(0);
    setInfoOpen(false);
  }

  // handleMouseMove updates the cursor direction based on the screen half being hovered.
  function handleMouseMove(event: MouseEvent<HTMLElement>) {
    setHoverSide(event.clientX < window.innerWidth / 2 ? "left" : "right");
  }

  // toggleInfo opens or closes the project details panel.
  function toggleInfo() {
    setInfoOpen((open) => !open);
  }

  return (
    <section
      id="our-redback-projects"
      className={`scroll-mt-10 bg-black-500 px-4 py-16 text-white sm:px-6 lg:px-10 ${
        hoverSide === "left" ? "cursor-project-left" : "cursor-project-right"
      }`}
      onClick={(event) => handleSectionClick(event, moveProject)}
      onMouseMove={handleMouseMove}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        <p className="text-b2 uppercase text-white/85">Explore</p>
        <h2 className="text-center text-h6 uppercase leading-tight text-white sm:text-h5">
          Our Redback Projects
        </h2>

        <div className="mt-7 flex gap-3">
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              aria-label={`Show ${project.name}`}
              className={`h-4 w-4 rounded-full transition-colors ${
                index === projectIndex ? "bg-blue-100" : "bg-blue-600 hover:bg-blue-300"
              }`}
              onClick={(event) => {
                event.stopPropagation();
                selectProject(index);
              }}
            />
          ))}
        </div>

        <ProjectCard
          key={activeProject.slug}
          imageIndex={imageIndex}
          infoOpen={infoOpen}
          project={activeProject}
          onToggleInfo={toggleInfo}
        />

        <h3 className="mt-8 max-w-full text-center text-[clamp(44px,8vw,86px)] font-bold uppercase leading-none text-white">
          {activeProject.name}.
        </h3>
      </div>
    </section>
  );
}

// handleSectionClick navigates projects from broad left/right clicks while leaving controls alone.
function handleSectionClick(
  event: MouseEvent<HTMLElement>,
  moveProject: (step: number) => void,
) {
  if ((event.target as HTMLElement).closest("button, [data-project-controls='true']")) {
    return;
  }

  const midpoint = window.innerWidth / 2;
  moveProject(event.clientX < midpoint ? -1 : 1);
}

// wrapIndex keeps carousel indexes looping smoothly in either direction.
function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}
 