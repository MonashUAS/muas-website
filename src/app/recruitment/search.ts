import type { SearchDocument } from "@/lib/search/types";
import { recruitmentConfig } from "./recruitment-data";

const openStatus = {
  heading: "Recruitment is Now Open",
  copy: "Join MUAS and help shape the next generation of drone technology.",
};

const closedStatus = {
  heading: "Ready to take flight?",
  copy: "Check back soon for future opportunities with Monash Uncrewed Aerial Systems!",
};

export const recruitmentSearchDocument: SearchDocument = {
  route: "/recruitment",
  title: "Recruitment",
  targets: [
    {
      id: "recruitment-page",
      label: "Recruitment",
      hash: "recruitment-page",
      text: [
        {
          id: "heading",
          text: "Recruitment",
          componentTargetId: "recruitment-page",
          highlightTargetId: "recruitment-heading",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "intro",
          text: "MUAS welcomes students from all backgrounds, technical and non-technical, to contribute to a team designing, building, testing, and flying uncrewed aerial systems.",
          componentTargetId: "recruitment-page",
          highlightTargetId: "recruitment-intro",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "status-heading",
          text: recruitmentConfig.isRecruitmentOpen
            ? openStatus.heading
            : closedStatus.heading,
          componentTargetId: "recruitment-page",
          highlightTargetId: "recruitment-status-heading",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "status-copy",
          text: recruitmentConfig.isRecruitmentOpen
            ? openStatus.copy
            : closedStatus.copy,
          componentTargetId: "recruitment-page",
          highlightTargetId: "recruitment-status-copy",
          highlightMode: "text",
          targetType: "text",
        },
        ...(recruitmentConfig.isRecruitmentOpen
          ? [
              {
                id: "apply",
                text: "Apply Now",
                componentTargetId: "recruitment-page",
                highlightTargetId: "recruitment-apply",
                highlightMode: "text" as const,
                targetType: "text" as const,
              },
            ]
          : []),
      ],
    },
  ],
};
