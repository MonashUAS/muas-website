"use client";

import { useEffect, useRef } from "react";
import type { Project } from "./project-data";

type ProjectInfoPanelProps = {
  project: Project;
  sharedCardHeight?: number;
  onMeasuredHeight?: (slug: string, height: number) => void;
};

// ProjectInfoPanel presents the active team's details inside each carousel slide.
export function ProjectInfoPanel({
  project,
  sharedCardHeight,
  onMeasuredHeight,
}: ProjectInfoPanelProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;

    if (!card || !content || !onMeasuredHeight) {
      return;
    }

    const measure = () => {
      const cardStyle = window.getComputedStyle(card);
      const verticalInset =
        Number.parseFloat(cardStyle.paddingTop) +
        Number.parseFloat(cardStyle.paddingBottom) +
        Number.parseFloat(cardStyle.borderTopWidth) +
        Number.parseFloat(cardStyle.borderBottomWidth);
      const measuredHeight = Math.ceil(
        content.getBoundingClientRect().height + verticalInset,
      );

      onMeasuredHeight(project.slug, measuredHeight);
    };
    const resizeObserver = new ResizeObserver(measure);

    resizeObserver.observe(content);
    measure();

    if (document.fonts) {
      void document.fonts.ready.then(measure);
    }

    return () => resizeObserver.disconnect();
  }, [onMeasuredHeight, project.slug]);

  return (
    <div
      ref={cardRef}
      data-redback-team-card=""
      className="rounded-[1.5rem] border border-white/10 bg-blue-950/55 px-6 py-7 shadow-[0_28px_96px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-8 sm:py-8 lg:px-10 lg:py-10"
      style={{ minHeight: sharedCardHeight ? `${sharedCardHeight}px` : undefined }}
      aria-live="polite"
    >
      <div
        ref={contentRef}
        key={project.slug}
        className="animate-[project-fade_420ms_ease] motion-reduce:animate-none"
      >
        <ProjectInfoContent project={project} />
      </div>
    </div>
  );
}

function ProjectInfoContent({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3
          data-search-target-id={`redback-project-${project.slug}-heading`}
          data-search-highlight-mode="text"
          className="text-h6 font-black tracking-[-0.05em] text-white sm:text-h5"
        >
          {project.name}
        </h3>
        <p
          data-search-target-id={`redback-project-${project.slug}-summary`}
          data-search-highlight-mode="text"
          className="mt-5 text-b1 leading-relaxed text-blue-50/80 sm:text-subtitle sm:leading-relaxed"
        >
          {project.summary}
        </p>
      </div>

      {project.leads?.length ? (
        <div>
          <p className="text-b2 text-blue-100/60">
            {project.leadLabel ??
              (project.leads.length === 1 ? "Team lead" : "Team leads")}
          </p>
          <ul
            data-search-target-id={`redback-project-${project.slug}-lead`}
            data-search-highlight-mode="text"
            className="mt-2 space-y-1.5 text-b1 text-blue-50/80"
          >
            {project.leads.map((lead) => (
              <li key={lead}>{lead}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.members?.length ? (
        <div>
          <p className="text-b2 text-blue-100/60">
            {project.memberLabel ??
              (project.members.length === 1 ? "Team member" : "Team members")}
          </p>
          <ul
            data-search-target-id={`redback-project-${project.slug}-team`}
            data-search-highlight-mode="text"
            className="mt-2 grid gap-x-6 gap-y-1.5 text-b1 text-blue-50/80 sm:grid-cols-2 lg:grid-cols-3"
          >
            {project.members.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.keyDecisions.length > 0 ? (
        <div className="space-y-4 border-t border-white/10 pt-6">
          <p className="text-b2 text-blue-100/60">Key design decisions</p>
          <ul className="grid gap-4 lg:grid-cols-2">
            {project.keyDecisions.map((decision) => (
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

      {project.testingProcess ? (
        <div className="space-y-4 border-t border-white/10 pt-6">
          <p className="text-b2 text-blue-100/60">Testing process</p>
          <p
            data-search-target-id={`redback-project-${project.slug}-testing-process`}
            data-search-highlight-mode="text"
            className="text-b1 leading-relaxed text-blue-50/80"
          >
            {project.testingProcess}
          </p>
        </div>
      ) : null}
    </div>
  );
}
