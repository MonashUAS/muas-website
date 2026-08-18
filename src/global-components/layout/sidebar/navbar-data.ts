export type NavLink = {
  href: string;
  label: string;
};

export type NavNestedGroup = {
  label: string;
  links: NavLink[];
};

export type NavGroup = {
  label: string;
  links: Array<NavLink | NavNestedGroup>;
};

// Navigation data stays separate from rendering so routes are easy to audit.
export const homeLink: NavLink = { href: "/", label: "Home" };

export const navigationGroups: NavGroup[] = [
  {
    label: "Explore",
    links: [
      { href: "/our-team", label: "Our Team" },
      { href: "/our-drones", label: "Our Drones" },
      { href: "/newsletter", label: "Our Newsletters" },
    ],
  },
  {
    label: "Teams",
    links: [
      { href: "/sections/aerostructures", label: "Aerostructures" },
      { href: "/sections/avionics", label: "Avionics" },
      { href: "/sections/flight-ops", label: "Flight Operations" },
      { href: "/sections/operations", label: "Operations" },
      { href: "/sections/propulsion", label: "Propulsion" },
    ],
  },
  {
    label: "SUAS 2026",
    links: [
      { href: "/suas-2026-home", label: "Redback" },
      { href: "/suas-2026-team", label: "The SUAS Team" },
    ],
  },
  {
    label: "NFC 2025",
    links: [
      { href: "/nfc-2025", label: "Peregrine MK II" },
    ],
  },
  {
    label: "Connect",
    links: [
      { href: "/our-sponsors", label: "Sponsor Us" },
      { href: "/recruitment", label: "Recruitment" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
];
