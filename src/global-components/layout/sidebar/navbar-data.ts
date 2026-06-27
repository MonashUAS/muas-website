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
    label: "Discover",
    links: [
      { href: "/our-team", label: "Our Team" },
      { href: "/our-drones", label: "Our Drones" },
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
  {
    label: "Teams",
    links: [
      { href: "/aerostructures", label: "Aerostructures" },
      { href: "/avionics", label: "Avionics" },
      { href: "/flight-ops", label: "Flight Operations" },
      { href: "/operations", label: "Operations" },
      { href: "/propulsion", label: "Propulsion" },
    ],
  },
  {
    label: "Competitions",
    links: [
      {
        label: "SUAS 2026",
        links: [
          { href: "/suas-2026-home", label: "Homepage" },
          { href: "/suas-2026-team", label: "Team" },
        ],
      },
      { href: "/nfc-2025", label: "NFC 2025" },
    ],
  },
  {
    label: "Connect",
    links: [
      { href: "/our-sponsors", label: "Sponsors" },
      { href: "/recruitment", label: "Recruitment" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
];
