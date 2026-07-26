export type ExplorePanel = {
  title: string;
  href: string;
  preview: string;
  image: string;
  alt: string;
};

// Panel labels/routes/copy live here so the homepage navigation has one edit point.
export const explorePanels: ExplorePanel[] = [
  {
    title: "Our Team",
    href: "/our-team",
    preview: "Meet the students behind MUAS and the teams building our aircraft.",
    image: "/images/homepage/quick-nav/our-team.webp",
    alt: "MUAS team members gathered for a group photo",
  },
  {
    title: "Our Drones",
    href: "/our-drones",
    preview: "See the aircraft, systems, and technology behind our builds.",
    image: "/images/homepage/quick-nav/our-drones.webp",
    alt: "MUAS aircraft on a flight field",
  },
  {
    title: "Recruitment",
    href: "/recruitment",
    preview: "Help shape the next generation of drone technology with MUAS.",
    image: "/images/homepage/quick-nav/recruitment_updated3.webp",
    alt: "MUAS recruitment and outreach activity",
  },
  {
    title: "Sponsor Us",
    href: "/our-sponsors",
    preview: "See the partners supporting student-led aerospace innovation.",
    image: "/images/homepage/quick-nav/sponsor-us_updated2.webp",
    alt: "MUAS aircraft and team activity supported by sponsors",
  },
  {
    title: "Contact Us",
    href: "/contact-us",
    preview:
      "Start a conversation with MUAS about partnerships, recruitment, or enquiries.",
    image: "/images/homepage/quick-nav/contact-us_updated.webp",
    alt: "MUAS members discussing aircraft systems",
  },
];
