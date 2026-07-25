import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { textSearchContent } from "@/lib/search/content";
import { projects, type Project } from "./projects/project-data";
import { timelineItems } from "./timeline-data";

function decisionSearchId(title: string) {
  return title.replaceAll(" ", "-").toLowerCase();
}

function getTimelineSearchTargets(): SearchTarget[] {
  return timelineItems.map((item) => ({
    id: `timeline-${item.slug}`,
    label: item.title,
    hash: "the-production-timeline",
    text: [
      textSearchContent({
        id: "date",
        text: item.date,
        componentTargetId: `timeline-${item.slug}`,
        highlightTargetId: `timeline-${item.slug}-date`,
      }),
      textSearchContent({
        id: "title",
        text: item.title,
        componentTargetId: `timeline-${item.slug}`,
        highlightTargetId: `timeline-${item.slug}-title`,
      }),
      textSearchContent({
        id: "body",
        text: item.body,
        componentTargetId: `timeline-${item.slug}`,
        highlightTargetId: `timeline-${item.slug}-body`,
      }),
    ],
    keywords: ["timeline", "production timeline", "redback"],
  }));
}

function getProjectSearchText(project: Project): SearchTarget["text"] {
  const text: SearchTarget["text"] = [
    {
      id: "heading",
      text: project.name,
      componentTargetId: `redback-project-${project.slug}`,
      highlightTargetId: `redback-project-${project.slug}-heading`,
      highlightMode: "text",
      targetType: "text",
    },
    {
      id: "summary",
      text: project.summary,
      componentTargetId: `redback-project-${project.slug}`,
      highlightTargetId: `redback-project-${project.slug}-summary`,
      highlightMode: "text",
      targetType: "text",
    },
  ];

  if (project.leads?.length) {
    text.push({
      id: "lead",
      text: project.leads.join(", "),
      componentTargetId: `redback-project-${project.slug}`,
      highlightTargetId: `redback-project-${project.slug}-lead`,
      highlightMode: "text",
      targetType: "text",
    });
  }

  if (project.members?.length) {
    text.push({
      id: "team",
      text: project.members.join(", "),
      componentTargetId: `redback-project-${project.slug}`,
      highlightTargetId: `redback-project-${project.slug}-team`,
      highlightMode: "text",
      targetType: "text",
    });
  }

  text.push(
    ...project.keyDecisions.flatMap((decision) => [
      {
        id: `decision-${decision.title}-title`,
        text: decision.title,
        componentTargetId: `redback-project-${project.slug}`,
        highlightTargetId: `redback-project-${project.slug}-decision-${decisionSearchId(decision.title)}-title`,
        highlightMode: "text" as const,
        targetType: "text" as const,
      },
      {
        id: `decision-${decision.title}-body`,
        text: decision.body,
        componentTargetId: `redback-project-${project.slug}`,
        highlightTargetId: `redback-project-${project.slug}-decision-${decisionSearchId(decision.title)}-body`,
        highlightMode: "text" as const,
        targetType: "text" as const,
      },
    ]),
  );

  if (project.testingProcess) {
    text.push({
      id: "testing-process",
      text: project.testingProcess,
      componentTargetId: `redback-project-${project.slug}`,
      highlightTargetId: `redback-project-${project.slug}-testing-process`,
      highlightMode: "text",
      targetType: "text",
    });
  }

  return text;
}

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
    ...getTimelineSearchTargets(),
    ...projects.map(
      (project): SearchTarget => ({
        id: `redback-project-${project.slug}`,
        label: project.name,
        hash: "our-redback-projects",
        text: getProjectSearchText(project),
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
