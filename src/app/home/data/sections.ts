export type HomepageSection = {
  title: string;
  href: string;
  description: string;
  image: string;
  alt: string;
  objectPosition?: string;
};

// Homepage-only team section data.
export const homepageSections: HomepageSection[] = [
  {
    title: "Aerostructures",
    href: "/sections/aerostructures",
    description: "Designing, building, and refining the aircraft frame.",
    image: "/images/homepage/sections/aerostructures_updated.jpg",
    alt: "Aerostructures team work on aircraft hardware",
    objectPosition: "50% 42%",
  },
  {
    title: "Avionics",
    href: "/sections/avionics",
    description: "Developing the electronics, software, and onboard systems.",
    image: "/images/homepage/sections/avionics.jpg",
    alt: "Avionics electronics and flight systems workbench",
  },
  {
    title: "Flight Operations",
    href: "/sections/flight-ops",
    description: "Planning, testing, and supporting safe aircraft flights.",
    image: "/images/homepage/sections/flight-operations_updated.jpg",
    alt: "Flight Operations team preparing for testing",
    objectPosition: "50% 60%",
  },
  {
    title: "Propulsion",
    href: "/sections/propulsion",
    description: "Building and validating the systems that keep our aircraft moving.",
    image: "/images/homepage/sections/propulsion.jpg",
    alt: "Propulsion testing and aircraft components",
  },
  {
    title: "Operations",
    href: "/sections/operations",
    description: "Coordinating the people, logistics, and planning behind the team.",
    image: "/images/homepage/sections/operations_updated_final.jpg",
    alt: "Operations team coordinating MUAS activities",
  },
];
