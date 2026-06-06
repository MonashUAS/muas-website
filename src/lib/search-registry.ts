export type SearchResult = {
  title: string;
  category: string;
  url: string;
};

export const searchRegistry: SearchResult[] = [
  { title: "Home", category: "Page", url: "/" },
  { title: "Our Team", category: "Page", url: "/our-team" },
  { title: "Aerostructures", category: "Our Team", url: "/aerostructures" },
  { title: "Avionics", category: "Our Team", url: "/avionics" },
  { title: "Flight Operations", category: "Our Team", url: "/flight-ops" },
  { title: "Operations", category: "Our Team", url: "/operations" },
  { title: "Propulsion", category: "Our Team", url: "/propulsion" },
  { title: "Our Drones", category: "Page", url: "/our-drones" },
  { title: "Competitions", category: "Page", url: "/competitions" },
  { title: "NFC 2025", category: "Competitions", url: "/nfc-2025" },
  {
    title: "SUAS 2026 Homepage",
    category: "Competitions",
    url: "/suas-2026-home",
  },
  {
    title: "Redback Key Features",
    category: "SUAS 2026",
    url: "/suas-2026-home#key-features",
  },
  {
    title: "Redback Technical Specifications",
    category: "SUAS 2026",
    url: "/suas-2026-home#technical-specifications",
  },
  { title: "SUAS 2026 Team", category: "Competitions", url: "/suas-2026-team" },
  {
    title: "Redback Team",
    category: "SUAS 2026",
    url: "/suas-2026-team#the-redback-team",
  },
  {
    title: "Redback Timeline",
    category: "SUAS 2026",
    url: "/suas-2026-team#the-production-timeline",
  },
  {
    title: "Redback Projects",
    category: "SUAS 2026",
    url: "/suas-2026-team#our-redback-projects",
  },
  { title: "Our Sponsors", category: "Page", url: "/our-sponsors" },
  { title: "Recruitment", category: "Page", url: "/recruitment" },
  { title: "Contact Us", category: "Page", url: "/contact-us" },
];
