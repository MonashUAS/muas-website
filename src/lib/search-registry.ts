import { explorePanels } from "@/app/home/data/explore-panels";
import { drones } from "@/app/our-drones/drone-data";
import {
  sponsorBenefitItems,
  sponsorCarouselHeading,
  sponsorCtaLabel,
  sponsorHeroParagraph,
  sponsorImpactStats,
  sponsorWhyCopy,
  sponsorWhyHeading,
} from "@/app/our-sponsors/sponsor-page-data";
import { sections } from "@/app/sections/section-data";
import { keyFeatures } from "@/app/suas-2026-home/key-features-data";
import { scrollHeroCopy } from "@/app/suas-2026-home/scroll-hero-data";
import { techSpecCards, techSpecSystemGroups } from "@/app/suas-2026-home/tech-specs-data";
import { projects } from "@/app/suas-2026-team/projects/project-data";
import { sponsorRows } from "@/global-components/modules/sponsor-grid";

export type SearchContent = {
  text: string;
  href?: string;
};

export type SearchSection = {
  label: string;
  anchor?: string;
  content: SearchContent[];
};

export type SearchEntry = {
  title: string;
  category: string;
  url: string;
  sections: SearchSection[];
};

// Global search index built from visible page content.
// Excluded from search: /newsletter, /nfc-2025, /competitions, /our-drones/[droneSlug]

function t(text: string, href?: string): SearchContent {
  return href ? { text, href } : { text };
}

function specStrings(
  specs: Array<{ label: string; value: string }>,
): SearchContent[] {
  return specs.map((spec) => t(`${spec.label}: ${spec.value}`));
}

function buildTeamSectionEntries(): SearchEntry[] {
  return sections.map((section) => ({
    title: section.name,
    category: "Teams",
    url: `/sections/${section.slug}`,
    sections: [
      {
        label: "Team Overview",
        anchor: "team-overview",
        content: [
          t(section.shortDescription),
          t(section.description),
          ...section.leads.map((lead) => t(lead.name)),
        ],
      },
      {
        label: "Projects",
        anchor: "team-projects",
        content: section.projects.flatMap((project) => [
          t(project.name),
          t(project.description),
        ]),
      },
    ],
  }));
}

function buildOurDronesEntry(): SearchEntry {
  return {
    title: "Our Drones",
    category: "Discover",
    url: "/our-drones",
    sections: [
      {
        label: "Our Drones",
        anchor: "our-drones-page",
        content: [t("Our Drones")],
      },
      ...drones.map((drone) => ({
        label: drone.name,
        anchor: "our-drones-page",
        content: [
          ...drone.description.map((line) => t(line)),
          ...specStrings(drone.features),
          ...specStrings(drone.dimensions),
        ],
      })),
    ],
  };
}

function buildHomeEntry(): SearchEntry {
  return {
    title: "Home",
    category: "Page",
    url: "/",
    sections: [
      {
        label: "Hero",
        anchor: "homepage-hero",
        content: [
          t("Redefining Drone Technology"),
          t("Explore Our Drones", "/our-drones"),
          t("Join The Team", "/recruitment"),
        ],
      },
      {
        label: "Explore Panels",
        anchor: "homepage-explore-panels",
        content: explorePanels.flatMap((panel) => [
          t(panel.title, panel.href),
          t(panel.preview, panel.href),
        ]),
      },
      {
        label: "Redback Teaser",
        anchor: "homepage-redback-teaser",
        content: [
          t("Introducing Redback"),
          t(
            "Built for SUAS 2026, Redback is MUAS' newest custom quadcopter, designed for autonomous flight, aerial mapping, payload delivery, endurance, and transportability.",
          ),
          t("Learn More", "/suas-2026-home"),
        ],
      },
      {
        label: "Footer",
        anchor: "site-footer",
        content: [
          t(
            "Monash Uncrewed Aerial Systems - Demonstrating the humanitarian potential of Drone Technology since 2011.",
          ),
        ],
      },
    ],
  };
}

function buildOurInitiativeEntry(): SearchEntry {
  const heroLines = scrollHeroCopy.flatMap((copy) => copy.lines);

  return {
    title: "Our Initiative",
    category: "SUAS 2026",
    url: "/suas-2026-home",
    sections: [
      {
        label: "Hero",
        anchor: "suas-hero",
        content: heroLines.map((line) => t(line)),
      },
      {
        label: "Key Features",
        anchor: "key-features",
        content: keyFeatures.flatMap((feature) => [
          t(feature.title),
          t(feature.body),
        ]),
      },
      {
        label: "Technical Specifications",
        anchor: "technical-specifications",
        content: [
          t("Technical Specifications"),
          t("Systems"),
          ...techSpecCards.flatMap((spec) => [
            t(spec.label),
            t(spec.value),
            t(spec.hoverValue),
            t(spec.caption),
          ]),
          ...techSpecSystemGroups.flatMap((group) => [
            t(group.title),
            ...group.rows.flatMap((row) => [t(row.label), t(row.value)]),
          ]),
        ],
      },
      {
        label: "The Redback Team",
        anchor: "redback-team-link",
        content: [
          t("The Redback Team"),
          t(
            "Learn about the people behind Redback and key design decisions made along the way towards SUAS 2026.",
          ),
          t("View the Journey", "/suas-2026-team"),
        ],
      },
    ],
  };
}

function buildSuasTeamEntry(): SearchEntry {
  return {
    title: "The SUAS Team",
    category: "SUAS 2026",
    url: "/suas-2026-team",
    sections: [
      {
        label: "Team Page",
        anchor: "suas-team-page",
        content: [t("SUAS 2026"), t("The SUAS Team")],
      },
      {
        label: "The Redback Team",
        anchor: "the-redback-team",
        content: [t("The Redback Team"), t("Redback Team")],
      },
      {
        label: "The Production Timeline",
        anchor: "the-production-timeline",
        content: [t("The Production Timeline"), t("Redback Timeline")],
      },
      {
        label: "Redback Projects",
        anchor: "our-redback-projects",
        content: [
          t("Our Redback Projects"),
          ...projects.flatMap((project) => [
            t(project.name),
            t(project.description),
            ...project.decisions.flatMap((decision) => [
              t(decision.title),
              t(decision.body),
            ]),
          ]),
        ],
      },
    ],
  };
}

function buildSponsorUsEntry(): SearchEntry {
  const sponsorNames = sponsorRows.flatMap((row) =>
    row.sponsors.map((sponsor) => sponsor.name),
  );

  return {
    title: "Sponsor Us",
    category: "Connect",
    url: "/our-sponsors",
    sections: [
      {
        label: "Sponsor Hero",
        anchor: "sponsor-hero",
        content: [t("Sponsor Us"), t(sponsorHeroParagraph)],
      },
      {
        label: "Impact Stats",
        anchor: "sponsor-hero",
        content: sponsorImpactStats.flatMap((stat) => [
          t(stat.value),
          t(stat.label),
        ]),
      },
      {
        label: "Sponsor Carousel",
        anchor: "thanks-to-heading",
        content: [t(sponsorCarouselHeading), ...sponsorNames.map((name) => t(name))],
      },
      {
        label: "Why Sponsor MUAS",
        anchor: "why-sponsor-muas",
        content: [
          t(sponsorWhyHeading),
          t(sponsorWhyCopy),
          t(sponsorCtaLabel, "/contact-us"),
          ...sponsorBenefitItems.flatMap((benefit) => [
            t(benefit.title),
            t(benefit.description),
          ]),
        ],
      },
    ],
  };
}

function buildRecruitmentEntry(): SearchEntry {
  return {
    title: "Recruitment",
    category: "Connect",
    url: "/recruitment",
    sections: [
      {
        label: "Recruitment Page",
        anchor: "recruitment-page",
        content: [
          t("Recruitment"),
          t(
            "MUAS welcomes students from all backgrounds, technical and non-technical, to contribute to a team designing, building, testing, and flying uncrewed aerial systems.",
          ),
          t("Recruitment is Now Open"),
          t("Join MUAS and help shape the next generation of drone technology."),
          t("Ready to take flight?"),
          t(
            "Check back soon for future opportunities with Monash Uncrewed Aerial Systems!",
          ),
          t("Apply Now"),
        ],
      },
    ],
  };
}

function buildContactUsEntry(): SearchEntry {
  return {
    title: "Contact Us",
    category: "Connect",
    url: "/contact-us",
    sections: [
      {
        label: "Contact Page",
        anchor: "contact-page",
        content: [
          t("Get in Touch"),
          t("Name"),
          t("Email"),
          t("Subject"),
          t("Message"),
          t("Send Message"),
          t("Message sent successfully. We'll get back to you soon."),
        ],
      },
      {
        label: "Find Us Online",
        anchor: "find-us-online",
        content: [
          t("Find Us Online"),
          t("Facebook"),
          t("Instagram"),
          t("LinkedIn"),
          t("YouTube"),
          t("Email"),
          t("Follow us"),
          t("Connect with us"),
          t("Subscribe"),
          t("contact@monashuas.org"),
        ],
      },
    ],
  };
}

export const searchRegistry: SearchEntry[] = [
  buildHomeEntry(),
  {
    title: "Our Team",
    category: "Discover",
    url: "/our-team",
    sections: [
      {
        label: "Team Page",
        anchor: "our-team-page",
        content: [t("Our Team")],
      },
    ],
  },
  buildOurDronesEntry(),
  ...buildTeamSectionEntries(),
  buildOurInitiativeEntry(),
  buildSuasTeamEntry(),
  buildSponsorUsEntry(),
  buildRecruitmentEntry(),
  buildContactUsEntry(),
];

export function resolveSearchHref(
  entry: SearchEntry,
  section: SearchSection,
  content?: SearchContent,
) {
  if (content?.href) {
    return content.href;
  }

  if (section.anchor) {
    return `${entry.url}#${section.anchor}`;
  }

  return entry.url;
}
