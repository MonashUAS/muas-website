export type SearchResult = {
  title: string;
  category: string;
  url: string;
  description: string;
  keywords?: string[];
};

// Static source for the navbar global search. Descriptions are display copy;
// keywords are hidden matching aids that should not appear as raw result text.
export const searchRegistry: SearchResult[] = [
  {
    title: "Home",
    category: "Page",
    url: "/",
    description:
      "Start from the MUAS homepage and explore the team, aircraft, competitions, sponsors, and recruitment pathways.",
    keywords: ["muas", "monash uas"],
  },
  {
    title: "Our Team",
    category: "Discover",
    url: "/our-team",
    description:
      "Meet the people and subteams building, operating, and supporting MUAS aircraft.",
    keywords: ["members", "people", "subteams"],
  },
  {
    title: "Our Drones",
    category: "Discover",
    url: "/our-drones",
    description:
      "Explore MUAS flight platforms, aircraft systems, and drone design work.",
    keywords: ["aircraft", "uav", "uas", "drones"],
  },
  {
    title: "Newsletter",
    category: "Discover",
    url: "/newsletter",
    description:
      "Read updates from MUAS, including team news, project progress, and competition activity.",
    keywords: ["updates", "news"],
  },
  {
    title: "Aerostructures",
    category: "Teams",
    url: "/aerostructures",
    description:
      "Learn about the team responsible for airframes, structures, composites, and aircraft integration.",
    keywords: ["airframe", "structures", "composites"],
  },
  {
    title: "Avionics",
    category: "Teams",
    url: "/avionics",
    description:
      "See how MUAS develops onboard electronics, software, sensing, and aircraft control systems.",
    keywords: ["electronics", "software", "systems"],
  },
  {
    title: "Flight Operations",
    category: "Teams",
    url: "/flight-ops",
    description:
      "Find out how MUAS plans, tests, and operates aircraft safely during flight campaigns.",
    keywords: ["flight ops", "pilots", "testing"],
  },
  {
    title: "Operations",
    category: "Teams",
    url: "/operations",
    description:
      "Explore the business, logistics, media, and organisational work that keeps MUAS running.",
    keywords: ["business", "logistics", "media"],
  },
  {
    title: "Propulsion",
    category: "Teams",
    url: "/propulsion",
    description:
      "Learn about the motors, batteries, powertrain, and performance systems behind MUAS aircraft.",
    keywords: ["motor", "battery", "powertrain"],
  },
  {
    title: "Competitions",
    category: "Competitions",
    url: "/competitions",
    description:
      "Browse MUAS competition programs, mission challenges, and event participation.",
    keywords: ["events", "missions"],
  },
  {
    title: "NFC 2025",
    category: "Competitions",
    url: "/nfc-2025",
    description:
      "View MUAS work for the 2025 National Flying Challenge competition.",
    keywords: ["national flying challenge"],
  },
  {
    title: "SUAS 2026 Homepage",
    category: "Competitions",
    url: "/suas-2026-home",
    description:
      "Discover Redback, the MUAS aircraft platform developed for the SUAS 2026 mission.",
    keywords: ["suas", "redback", "aircraft"],
  },
  {
    title: "Redback Key Features",
    category: "SUAS 2026",
    url: "/suas-2026-home#key-features",
    description:
      "Jump to Redback's key aircraft features, mission capabilities, and design highlights.",
    keywords: ["features", "aircraft", "redback"],
  },
  {
    title: "Redback Technical Specifications",
    category: "SUAS 2026",
    url: "/suas-2026-home#technical-specifications",
    description:
      "Review Redback's technical specifications, aircraft configuration, and performance details.",
    keywords: ["specifications", "specs", "redback"],
  },
  {
    title: "SUAS 2026 Team",
    category: "Competitions",
    url: "/suas-2026-team",
    description:
      "Meet the team developing Redback and coordinating the SUAS 2026 build.",
    keywords: ["suas", "redback", "team"],
  },
  {
    title: "Redback Team",
    category: "SUAS 2026",
    url: "/suas-2026-team#the-redback-team",
    description:
      "Jump to the people and roles behind the Redback aircraft program.",
    keywords: ["team", "redback"],
  },
  {
    title: "Redback Timeline",
    category: "SUAS 2026",
    url: "/suas-2026-team#the-production-timeline",
    description:
      "See the Redback production timeline from planning through build and testing.",
    keywords: ["timeline", "production", "redback"],
  },
  {
    title: "Redback Projects",
    category: "SUAS 2026",
    url: "/suas-2026-team#our-redback-projects",
    description:
      "Browse Redback project areas and the engineering work supporting the SUAS aircraft.",
    keywords: ["projects", "redback"],
  },
  {
    title: "Sponsors",
    category: "Connect",
    url: "/our-sponsors",
    description:
      "Learn about the sponsors and partners supporting MUAS projects and competitions.",
    keywords: ["our sponsors", "partners"],
  },
  {
    title: "Recruitment",
    category: "Connect",
    url: "/recruitment",
    description:
      "Find out how to join MUAS and contribute to aircraft, operations, business, and competition work.",
    keywords: ["join", "apply", "careers"],
  },
  {
    title: "Contact Us",
    category: "Connect",
    url: "/contact-us",
    description:
      "Get in touch with MUAS for enquiries, partnerships, recruitment, or general contact.",
    keywords: ["contact", "email", "location"],
  },
];
