import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { textSearchContent } from "@/lib/search/content";
import { teamSections } from "./data/team-data";

function memberSlug(name: string) {
  return name.toLowerCase().replaceAll(" ", "-");
}

export const ourTeamSearchDocument: SearchDocument = {
  route: "/our-team",
  title: "Our Team",
  targets: [
    {
      id: "our-team-page",
      label: "Our Team",
      hash: "our-team-page",
      text: [
        textSearchContent({
          id: "heading",
          text: "Meet the Team",
          componentTargetId: "our-team-page",
          highlightTargetId: "our-team-hero-heading",
        }),
        textSearchContent({
          id: "intro",
          text: "More than 100 students across five specialised sections combine engineering, software, manufacturing, operations and flight testing to design, build and fly capable autonomous aircraft.",
          componentTargetId: "our-team-page",
          highlightTargetId: "our-team-hero-intro",
        }),
      ],
    },
    {
      id: "our-mission",
      label: "Our Mission",
      hash: "our-mission",
      text: [
        textSearchContent({
          id: "heading",
          text: "Our Mission",
          componentTargetId: "our-mission",
          highlightTargetId: "our-mission-heading",
        }),
        textSearchContent({
          id: "members",
          text: "Monash UAS brings together more than 100 members across five specialised sections, each contributing to the design, production and operation of our aircraft.",
          componentTargetId: "our-mission",
          highlightTargetId: "our-mission-members",
        }),
        textSearchContent({
          id: "humanitarian-potential",
          text: "Our mission is to demonstrate the humanitarian potential of uncrewed aerial systems while giving students practical experience through competition, flight testing and real-world engineering.",
          componentTargetId: "our-mission",
          highlightTargetId: "our-mission-humanitarian-potential",
        }),
        textSearchContent({
          id: "outreach",
          text: "Through workshops and outreach, we also aim to inspire the next generation of STEM students.",
          componentTargetId: "our-mission",
          highlightTargetId: "our-mission-outreach",
        }),
      ],
    },
    ...teamSections.map(
      (section): SearchTarget => ({
        id: `team-section-${section.id}`,
        label: section.label === "All" ? "Management Team" : section.label,
        hash: "management-team",
        text: [
          {
            id: "label",
            text: section.label,
            highlightTargetId: `team-section-${section.id}-description`,
            highlightMode: "text",
          },
          {
            id: "description",
            text: section.description,
            highlightTargetId: `team-section-${section.id}-description`,
            highlightMode: "text",
          },
          ...section.members.flatMap((member) => [
            {
              id: `member-${memberSlug(member.name)}-name`,
              text: member.name,
              componentTargetId: `team-section-${section.id}`,
              highlightTargetId: `team-member-${memberSlug(member.name)}-name`,
              highlightMode: "text" as const,
              targetType: "text" as const,
            },
            {
              id: `member-${memberSlug(member.name)}-role`,
              text: member.role,
              componentTargetId: `team-section-${section.id}`,
              highlightTargetId: `team-member-${memberSlug(member.name)}-role`,
              highlightMode: "text" as const,
              targetType: "text" as const,
            },
          ]),
        ],
        keywords: [section.label, ...section.members.map((member) => member.section)],
        interaction: {
          type: "pill",
          groupId: "management-team",
          value: section.id,
        },
        reveal: {
          expand: {
            id: "management-team",
            itemId: section.id,
          },
        },
      }),
    ),
    {
      id: "join-team-callout",
      label: "Join The Team",
      hash: "join-team-callout",
      text: [
        textSearchContent({
          id: "heading",
          text: "WWant To Become Part of Our Team?",
          componentTargetId: "join-team-callout",
          highlightTargetId: "join-team-callout-heading",
        }),
        textSearchContent({
          id: "copy",
          text: "Build real autonomous aircraft alongside students from engineering, software, manufacturing, operations and flight testing. Gain practical experience, contribute to meaningful projects and help shape what Monash UAS builds next.",
          componentTargetId: "join-team-callout",
          highlightTargetId: "join-team-callout-copy",
        }),
        textSearchContent({
          id: "cta",
          text: "Apply now",
          componentTargetId: "join-team-callout",
          highlightTargetId: "join-team-callout-cta",
        }),
      ],
    },
  ],
};
