import type { SearchDocument, SearchTarget } from "@/lib/search/types";
import { componentSearchContent, textSearchContent } from "@/lib/search/content";
import { explorePanels } from "./data/explore-panels";
import { homepageSections } from "./data/sections";

function routeTargetId(href: string) {
  return href.replaceAll("/", "-").replace(/^-/, "");
}

export const homeSearchDocument: SearchDocument = {
  route: "/",
  title: "Home",
  targets: [
    {
      id: "home-hero",
      label: "Hero",
      hash: "homepage-hero",
      text: [
        {
          id: "heading",
          text: "Redefining Drone Technology",
          componentTargetId: "homepage-hero",
          highlightTargetId: "home-hero-heading",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "explore-drones",
          text: "Explore Our Drones",
          componentTargetId: "homepage-hero",
          highlightTargetId: "home-hero-explore-drones",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "join-team",
          text: "Join The Team",
          componentTargetId: "homepage-hero",
          highlightTargetId: "home-hero-join-team",
          highlightMode: "text",
          targetType: "text",
        },
      ],
    },
    ...explorePanels.map(
      (panel): SearchTarget => ({
        id: `home-explore-${panel.href.replaceAll("/", "-").replace(/^-/, "")}`,
        label: panel.title,
        hash: "homepage-explore-panels",
        text: [
          componentSearchContent("title", panel.title),
          componentSearchContent("preview", panel.preview),
        ],
        keywords: [panel.href],
      }),
    ),
    {
      id: "home-sections-overview",
      label: "Explore Our Sections",
      hash: "homepage-sections",
      text: [
        textSearchContent({
          id: "heading",
          text: "Explore Our Sections",
          componentTargetId: "home-sections-overview",
          highlightTargetId: "homepage-sections-heading",
        }),
        textSearchContent({
          id: "description",
          text: "From operations to propulsion, every MUAS section plays a critical role in taking our systems from concept to reality.",
          componentTargetId: "home-sections-overview",
          highlightTargetId: "homepage-sections-description",
        }),
      ],
    },
    ...homepageSections.map(
      (section): SearchTarget => ({
        id: `home-sections-${routeTargetId(section.href)}`,
        label: section.title,
        hash: "homepage-sections",
        text: [
          {
            id: "heading",
            text: section.title,
            componentTargetId: `home-sections-${routeTargetId(section.href)}`,
            highlightTargetId: `home-sections-${routeTargetId(section.href)}-heading`,
            highlightMode: "text",
            targetType: "text",
          },
          {
            id: "description",
            text: section.description,
            componentTargetId: `home-sections-${routeTargetId(section.href)}`,
            highlightTargetId: `home-sections-${routeTargetId(section.href)}-description`,
            highlightMode: "text",
            targetType: "text",
          },
          {
            id: "cta",
            text: "Visit section",
            componentTargetId: `home-sections-${routeTargetId(section.href)}`,
            highlightTargetId: `home-sections-${routeTargetId(section.href)}-cta`,
            highlightMode: "text",
            targetType: "text",
          },
        ],
        reveal: {
          carousel: {
            id: "homepage-sections-carousel",
            slideId: section.href,
          },
        },
      }),
    ),
    {
      id: "home-redback-teaser",
      label: "Introducing Redback",
      hash: "homepage-redback-teaser",
      text: [
        {
          id: "heading",
          text: "Introducing Redback",
          componentTargetId: "homepage-redback-teaser",
          highlightTargetId: "home-redback-teaser-heading",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "copy",
          text: "Built for SUAS 2026, Redback is MUAS' newest custom quadcopter, designed for autonomous flight, aerial mapping, payload delivery, endurance, and transportability.",
          componentTargetId: "homepage-redback-teaser",
          highlightTargetId: "home-redback-teaser-copy",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "cta",
          text: "Learn More",
          componentTargetId: "homepage-redback-teaser",
          highlightTargetId: "home-redback-teaser-cta",
          highlightMode: "text",
          targetType: "text",
        },
      ],
    },
    {
      id: "home-footer",
      label: "Footer",
      hash: "site-footer",
      text: [
        {
          id: "humanitarian-potential",
          text: "Monash Uncrewed Aerial Systems - Demonstrating the humanitarian potential of Drone Technology since 2011.",
          componentTargetId: "site-footer",
          highlightTargetId: "footer-humanitarian-potential",
          highlightMode: "text",
          targetType: "text",
        },
      ],
    },
  ],
};
