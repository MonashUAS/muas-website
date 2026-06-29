export type HomepageSection = {
  title: string;
  href: string;
  description: string;
  image: string;
  alt: string;
};

const temporarySectionImage =
  "/images/placeholder (to be replaced)/placeholder image.jpg";

// Homepage-only team section data. Placeholder images are temporary; swap
// image/alt values here when final team photography is available.
export const homepageSections: HomepageSection[] = [
  {
    title: "Aerostructures",
    href: "/aerostructures",
    description: "Designing, building, and refining the aircraft frame.",
    image: temporarySectionImage,
    alt: "Temporary Aerostructures section placeholder",
  },
  {
    title: "Avionics",
    href: "/avionics",
    description: "Developing the electronics, software, and onboard systems.",
    image: temporarySectionImage,
    alt: "Temporary Avionics section placeholder",
  },
  {
    title: "Flight Operations",
    href: "/flight-ops",
    description: "Planning, testing, and supporting safe aircraft flights.",
    image: temporarySectionImage,
    alt: "Temporary Flight Operations section placeholder",
  },
  {
    title: "Propulsion",
    href: "/propulsion",
    description: "Building and validating the systems that keep our aircraft moving.",
    image: temporarySectionImage,
    alt: "Temporary Propulsion section placeholder",
  },
  {
    title: "Operations",
    href: "/operations",
    description: "Coordinating the people, logistics, and planning behind the team.",
    image: temporarySectionImage,
    alt: "Temporary Operations section placeholder",
  },
];
