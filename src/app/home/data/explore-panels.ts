export type ExplorePanel = {
  title: string;
  href: string;
  preview: string;
  alt: string;
};

export const temporaryPanelImage =
  "/images/placeholder (to be replaced)/placeholder image.jpg";

// Temporary placeholder image. Replace each panel image before final production.
// Panel labels/routes/copy live here; all panels intentionally share the same
// image while final section photography is still being selected.
export const explorePanels: ExplorePanel[] = [
  {
    title: "Our Team",
    href: "/our-team",
    preview: "Meet the students behind MUAS and the teams building our aircraft.",
    alt: "Temporary Our Team panel placeholder",
  },
  {
    title: "Our Drones",
    href: "/our-drones",
    preview: "See the aircraft, systems, and technology behind our builds.",
    alt: "Temporary Our Drones panel placeholder",
  },
  {
    title: "Competitions",
    href: "/competitions",
    preview: "Follow our work across national and international UAV competitions.",
    alt: "Temporary Competitions panel placeholder",
  },
  {
    title: "Recruitment",
    href: "/recruitment",
    preview: "Help shape the next generation of drone technology with MUAS.",
    alt: "Temporary Recruitment panel placeholder",
  },
  {
    title: "Sponsor Us",
    href: "/our-sponsors",
    preview: "See the partners supporting student-led aerospace innovation.",
    alt: "Temporary Sponsor Us panel placeholder",
  },
  {
    title: "Contact",
    href: "/contact-us",
    preview:
      "Start a conversation with MUAS about partnerships, recruitment, or enquiries.",
    alt: "Temporary Contact panel placeholder",
  },
];
