import type { SearchDocument } from "@/lib/search/types";
import { sponsorRows } from "@/global-components/modules/sponsor-grid";
import { componentSearchContent, textSearchContent } from "@/lib/search/content";
import {
  sponsorBenefitItems,
  sponsorCarouselHeading,
  sponsorCtaLabel,
  sponsorHeroParagraph,
  sponsorImpactStats,
  sponsorWhyCopy,
  sponsorWhyHeading,
} from "./sponsor-page-data";

const sponsorNames = sponsorRows.flatMap((row) =>
  row.sponsors.map((sponsor) => sponsor.name),
);

export const ourSponsorsSearchDocument: SearchDocument = {
  route: "/our-sponsors",
  title: "Sponsor Us",
  targets: [
    {
      id: "sponsor-hero",
      label: "Sponsor Hero",
      hash: "sponsor-hero",
      text: [
        {
          id: "heading",
          text: "Sponsor Us",
          componentTargetId: "sponsor-hero",
          highlightTargetId: "sponsor-hero-heading",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "copy",
          text: sponsorHeroParagraph,
          componentTargetId: "sponsor-hero",
          highlightTargetId: "sponsor-hero-copy",
          highlightMode: "text",
          targetType: "text",
        },
      ],
    },
    {
      id: "sponsor-impact",
      label: "Impact Stats",
      hash: "sponsor-hero",
      text: sponsorImpactStats.flatMap((stat) => [
        {
          id: `${stat.label}-value`,
          text: stat.value,
          componentTargetId: "sponsor-hero",
          highlightTargetId: `sponsor-stat-${stat.label.toLowerCase().replaceAll(" ", "-")}-value`,
          highlightMode: "text" as const,
          targetType: "text" as const,
        },
        {
          id: `${stat.label}-label`,
          text: stat.label,
          componentTargetId: "sponsor-hero",
          highlightTargetId: `sponsor-stat-${stat.label.toLowerCase().replaceAll(" ", "-")}-label`,
          highlightMode: "text" as const,
          targetType: "text" as const,
        },
      ]),
    },
    {
      id: "sponsor-carousel",
      label: "Sponsor Carousel",
      hash: "thanks-to-heading",
      text: [
        textSearchContent({
          id: "heading",
          text: sponsorCarouselHeading,
          componentTargetId: "sponsor-carousel",
          highlightTargetId: "thanks-to-heading",
        }),
        ...sponsorNames.map((name) => componentSearchContent(name, name)),
      ],
    },
    {
      id: "why-sponsor-muas",
      label: "Why Sponsor MUAS",
      hash: "why-sponsor-muas",
      text: [
        {
          id: "heading",
          text: sponsorWhyHeading,
          componentTargetId: "why-sponsor-muas",
          highlightTargetId: "why-sponsor-heading",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "copy",
          text: sponsorWhyCopy,
          componentTargetId: "why-sponsor-muas",
          highlightTargetId: "why-sponsor-copy",
          highlightMode: "text",
          targetType: "text",
        },
        {
          id: "cta",
          text: sponsorCtaLabel,
          componentTargetId: "why-sponsor-muas",
          highlightTargetId: "why-sponsor-cta",
          highlightMode: "text",
          targetType: "text",
        },
        ...sponsorBenefitItems.flatMap((benefit) => [
          {
            id: `${benefit.title}-title`,
            text: benefit.title,
            componentTargetId: "why-sponsor-muas",
            highlightTargetId: `sponsor-benefit-${benefit.title.toLowerCase().replaceAll(" ", "-")}-title`,
            highlightMode: "text" as const,
            targetType: "text" as const,
          },
          {
            id: `${benefit.title}-description`,
            text: benefit.description,
            componentTargetId: "why-sponsor-muas",
            highlightTargetId: `sponsor-benefit-${benefit.title.toLowerCase().replaceAll(" ", "-")}-description`,
            highlightMode: "text" as const,
            targetType: "text" as const,
          },
        ]),
      ],
    },
  ],
};
