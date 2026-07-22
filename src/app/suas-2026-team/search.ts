import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { textSearchContent } from "@/lib/search/content";
import { projects } from "./projects/project-data";

export const suasTeamSearchDocument: SearchDocument = {
  route: "/suas-2026-team",
  title: "The SUAS Team",
  targets: [
    {
      id: "suas-team-page",
      label: "Team Page",
      hash: "suas-team-page",
      text: [
        textSearchContent({
          id: "heading",
          text: "The Team Behind Redback",
          componentTargetId: "suas-team-page",
          highlightTargetId: "suas-team-heading",
        }),
        textSearchContent({
          id: "intro",
          text: "Explore the rationale, development and key milestones behind Redback, from its initial design through manufacturing, testing and flight.",
          componentTargetId: "suas-team-page",
          highlightTargetId: "suas-team-intro",
        }),
      ],
    },
    {
      id: "the-redback-team",
      label: "The Redback Team",
      hash: "the-redback-team",
      text: [
        textSearchContent({
          id: "heading",
          text: "Why We Built Redback",
          componentTargetId: "the-redback-team",
          highlightTargetId: "redback-team-heading",
        }),
        textSearchContent({
          id: "program",
          text: "Redback was developed to turn the 2026 SUAS mission into one integrated aircraft program.",
          componentTargetId: "the-redback-team",
          highlightTargetId: "redback-team-program",
        }),
        textSearchContent({
          id: "requirement",
          text: "The Requirement: Build one reliable aircraft that can search, map, avoid hazards and deliver a payload.",
          componentTargetId: "the-redback-team",
          highlightTargetId: "redback-team-requirement",
        }),
        textSearchContent({
          id: "approach",
          text: "The Approach: Develop every subsystem around a shared airframe focused on performance, integration and serviceability.",
          componentTargetId: "the-redback-team",
          highlightTargetId: "redback-team-approach",
        }),
        textSearchContent({
          id: "solution",
          text: "The Solution: Use Redback as a common test platform so avionics, autonomy, payloads and flight operations mature together before competition.",
          componentTargetId: "the-redback-team",
          highlightTargetId: "redback-team-solution",
        }),
      ],
    },
    {
      id: "the-production-timeline",
      label: "The Production Timeline",
      hash: "the-production-timeline",
      text: [
        textSearchContent({
          id: "heading",
          text: "The Production Timeline",
          componentTargetId: "the-production-timeline",
          highlightTargetId: "production-timeline-heading",
        }),
      ],
      keywords: ["Redback Timeline"],
    },
    ...projects.map(
      (project): SearchTarget => ({
        id: `redback-project-${project.slug}`,
        label: project.name,
        hash: "our-redback-projects",
        text: [
          {
            id: "heading",
            text: project.name,
            componentTargetId: `redback-project-${project.slug}`,
            highlightTargetId: `redback-project-${project.slug}-heading`,
            highlightMode: "text",
            targetType: "text",
          },
          {
            id: "description",
            text: project.description,
            componentTargetId: `redback-project-${project.slug}`,
            highlightTargetId: `redback-project-${project.slug}-description`,
            highlightMode: "text",
            targetType: "text",
          },
          {
            id: "lead",
            text: project.lead,
            componentTargetId: `redback-project-${project.slug}`,
            highlightTargetId: `redback-project-${project.slug}-lead`,
            highlightMode: "text",
            targetType: "text",
          },
          {
            id: "team",
            text: project.members.join(", "),
            componentTargetId: `redback-project-${project.slug}`,
            highlightTargetId: `redback-project-${project.slug}-team`,
            highlightMode: "text",
            targetType: "text",
          },
          ...project.decisions.flatMap((decision) => [
            {
              id: `decision-${decision.title}-title`,
              text: decision.title,
              componentTargetId: `redback-project-${project.slug}`,
              highlightTargetId: `redback-project-${project.slug}-decision-${decision.title.replaceAll(" ", "-").toLowerCase()}-title`,
              highlightMode: "text" as const,
              targetType: "text" as const,
            },
            {
              id: `decision-${decision.title}-body`,
              text: decision.body,
              componentTargetId: `redback-project-${project.slug}`,
              highlightTargetId: `redback-project-${project.slug}-decision-${decision.title.replaceAll(" ", "-").toLowerCase()}-body`,
              highlightMode: "text" as const,
              targetType: "text" as const,
            },
          ]),
        ],
        reveal: {
          carousel: {
            id: "redback-projects-carousel",
            slideId: project.slug,
          },
        },
      }),
    ),
  ],
};
