import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { textSearchContent } from "@/lib/search/content";
import { sections } from "./section-data";

export const sectionSearchDocuments: SearchDocument[] = sections.map(
  (section) => ({
    route: `/sections/${section.slug}`,
    title: section.name,
    targets: [
      {
        id: `${section.slug}-overview`,
        label: "Team Overview",
        hash: "team-overview",
        text: [
          textSearchContent({
            id: "heading",
            text: section.name,
            componentTargetId: `${section.slug}-overview`,
            highlightTargetId: `${section.slug}-overview-heading`,
          }),
          textSearchContent({
            id: "description",
            text: section.description,
            componentTargetId: `${section.slug}-overview`,
            highlightTargetId: `${section.slug}-overview-description`,
          }),
          ...section.leads.map((lead) =>
            textSearchContent({
              id: `lead-${lead.name.toLowerCase().replaceAll(" ", "-")}`,
              text: lead.name,
              componentTargetId: `${section.slug}-overview`,
              highlightTargetId: `${section.slug}-lead-${lead.name.toLowerCase().replaceAll(" ", "-")}`,
            }),
          ),
        ],
      },
      {
        id: `${section.slug}-responsibilities`,
        label: "Responsibilities",
        hash: "team-projects",
        text: [
          textSearchContent({
            id: "heading",
            text: "Responsibilities",
            componentTargetId: "team-projects",
            highlightTargetId: `${section.slug}-responsibilities-heading`,
          }),
        ],
      },
      ...section.projects.map(
        (project): SearchTarget => ({
          id: `${section.slug}-project-${project.slug}`,
          label: project.name,
          hash: "team-projects",
          text: [
            {
              id: "heading",
              text: project.name,
              componentTargetId: `${section.slug}-project-${project.slug}`,
              highlightTargetId: `${section.slug}-project-${project.slug}-heading`,
              highlightMode: "text",
              targetType: "text",
            },
            {
              id: "description",
              text: project.description,
              componentTargetId: `${section.slug}-project-${project.slug}`,
              highlightTargetId: `${section.slug}-project-${project.slug}-description`,
              highlightMode: "text",
              targetType: "text",
            },
          ],
          reveal: {
            carousel: {
              id: `${section.slug}-projects-carousel`,
              slideId: project.slug,
            },
          },
        }),
      ),
    ],
  }),
);
