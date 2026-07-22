"use client";

import { useEffect, useRef } from "react";
import { useSearchNavigation } from "@/global-components/search/search-navigation-provider";
import type { Project } from "./project-data";

// ProjectInfoPanel presents the active project's details beside the carousel.
export function ProjectInfoPanel({ project }: { project: Project }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { registerSearchTarget } = useSearchNavigation();

  useEffect(() => {
    if (!panelRef.current) {
      return;
    }

    const cleanups = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>("[data-search-target-id]"),
    ).flatMap((element) => {
      const targetId = element.dataset.searchTargetId;

      return targetId
        ? [
            registerSearchTarget(targetId, {
              element,
              highlightMode:
                element.dataset.searchHighlightMode === "text"
                  ? "text"
                  : "component",
            }),
          ]
        : [];
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [project.slug, registerSearchTarget]);

  return (
    <div
      ref={panelRef}
      className="flex h-[320px] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-blue-950/55 px-6 py-7 shadow-[0_28px_96px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:h-[440px] sm:px-8 sm:py-8 lg:h-[580px]"
      aria-live="polite"
    >
      <div
        key={project.slug}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto animate-[project-fade_420ms_ease] motion-reduce:animate-none"
      >
        <ProjectInfoContent project={project} />
      </div>
    </div>
  );
}

function ProjectInfoContent({ project }: { project: Project }) {
  const teamLabel =
    project.members.length === 1 && project.members[0] === "TBD"
      ? "Team details coming soon"
      : project.members.join(", ");

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div>
        <h3
          data-search-target-id={`redback-project-${project.slug}-heading`}
          data-search-highlight-mode="text"
          className="text-h6 font-black tracking-[-0.05em] text-white sm:text-h5"
        >
          {project.name}
        </h3>
        <p
          data-search-target-id={`redback-project-${project.slug}-description`}
          data-search-highlight-mode="text"
          className="mt-5 text-b1 leading-relaxed text-blue-50/80 sm:text-subtitle sm:leading-relaxed"
        >
          {project.description}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-b2 text-blue-100/60">Project lead</p>
          <p
            data-search-target-id={`redback-project-${project.slug}-lead`}
            data-search-highlight-mode="text"
            className="mt-2 text-b1 text-blue-50/80"
          >
            {project.lead}
          </p>
        </div>
        <div>
          <p className="text-b2 text-blue-100/60">Project team</p>
          <p
            data-search-target-id={`redback-project-${project.slug}-team`}
            data-search-highlight-mode="text"
            className="mt-2 text-b1 text-blue-50/80"
          >
            {teamLabel}
          </p>
        </div>
      </div>

      {project.decisions.length > 0 ? (
        <div className="mt-auto space-y-4 border-t border-white/10 pt-6">
          <p className="text-b2 text-blue-100/60">Design notes</p>
          <ul className="space-y-4">
            {project.decisions.map((decision) => (
              <li key={decision.title}>
                <p
                  data-search-target-id={`redback-project-${project.slug}-decision-${decision.title.replaceAll(" ", "-").toLowerCase()}-title`}
                  data-search-highlight-mode="text"
                  className="text-b1 text-white"
                >
                  {decision.title}
                </p>
                <p
                  data-search-target-id={`redback-project-${project.slug}-decision-${decision.title.replaceAll(" ", "-").toLowerCase()}-body`}
                  data-search-highlight-mode="text"
                  className="mt-1.5 text-b2 leading-relaxed text-blue-50/72"
                >
                  {decision.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
