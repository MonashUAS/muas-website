export type SectionLead = {
  name: string;
  image: string;
};

export type SectionProject = {
  name: string;
  description: string;
  image: string;
};

export type TeamSection = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  heroVideo: string;
  leads: SectionLead[];
  projects: SectionProject[];
};

const placeholderVideo = "/videos/placeholder-vid.mov";
const placeholderLead = "/images/headshots/sumi-b.png";
const placeholderProjectImages = [
  "/images/homepage/composites.jpg",
  "/images/homepage/flight-monitor.jpg",
  "/images/homepage/flight-day.jpg",
];

export const sectionOrder = [
  "aerostructures",
  "avionics",
  "flight-ops",
  "operations",
  "propulsion",
];

export const sections: TeamSection[] = [
  {
    slug: "aerostructures",
    name: "Aerostructures",
    shortDescription: "Designing, manufacturing, and validating the aircraft structure.",
    description:
      "Aerostructures turns mission requirements into reliable airframes, covering CAD, composites, structural testing, manufacturing methods, and aircraft integration.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Section Lead", image: placeholderLead },
      { name: "Deputy Section Lead", image: placeholderLead },
    ],
    projects: [
      {
        name: "Airframe Design",
        description: "Developing efficient structures that balance strength, weight, and manufacturability.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Composites",
        description: "Building composite parts and refining layup processes for consistent flight-ready results.",
        image: placeholderProjectImages[1],
      },
      {
        name: "Integration",
        description: "Preparing the airframe for payload, propulsion, avionics, and field maintenance needs.",
        image: placeholderProjectImages[2],
      },
    ],
  },
  {
    slug: "avionics",
    name: "Avionics",
    shortDescription: "Building the electrical and embedded systems that make the aircraft think.",
    description:
      "Avionics develops the aircraft electronics, embedded software, power distribution, communications, and sensing systems that support dependable autonomous flight.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Section Lead", image: placeholderLead },
      { name: "Deputy Section Lead", image: placeholderLead },
    ],
    projects: [
      {
        name: "Flight Computer",
        description: "Integrating flight-control hardware and software into a robust aircraft electronics stack.",
        image: placeholderProjectImages[1],
      },
      {
        name: "Telemetry",
        description: "Maintaining reliable aircraft-to-ground links for monitoring, debugging, and operations.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Power Systems",
        description: "Designing wiring, regulation, and protection for aircraft subsystems in flight.",
        image: placeholderProjectImages[0],
      },
    ],
  },
  {
    slug: "flight-ops",
    name: "Flight Operations",
    shortDescription: "Planning, testing, and executing safe flight activity.",
    description:
      "Flight Operations prepares aircraft for the field, coordinates test objectives, manages procedures, and captures the data needed to improve every flight.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Section Lead", image: placeholderLead },
      { name: "Deputy Section Lead", image: placeholderLead },
    ],
    projects: [
      {
        name: "Test Planning",
        description: "Turning engineering goals into safe, measurable, and repeatable flight-test plans.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Ground Station",
        description: "Operating the systems and workflows that keep pilots, engineers, and aircraft coordinated.",
        image: placeholderProjectImages[1],
      },
      {
        name: "Flight Review",
        description: "Analysing logs, observations, and aircraft behaviour after each testing campaign.",
        image: placeholderProjectImages[0],
      },
    ],
  },
  {
    slug: "operations",
    name: "Operations",
    shortDescription: "The team keeping the team running.",
    description:
      "Operations supports the people, planning, outreach, sponsorship, logistics, and communications that allow MUAS to deliver complex aircraft projects.",
    heroVideo: placeholderVideo,
    leads: [{ name: "Sumi Bandara", image: placeholderLead }],
    projects: [
      {
        name: "Marketing",
        description: "Managing social media, team storytelling, and public-facing updates across the season.",
        image: "/images/homepage/full-team-photo.jpg",
      },
      {
        name: "Sponsorship",
        description: "Building partner relationships and helping secure the resources needed for ambitious work.",
        image: placeholderProjectImages[1],
      },
      {
        name: "Logistics",
        description: "Coordinating events, field days, procurement, and the practical details behind delivery.",
        image: placeholderProjectImages[2],
      },
    ],
  },
  {
    slug: "propulsion",
    name: "Propulsion",
    shortDescription: "Powering aircraft with efficient and reliable propulsion systems.",
    description:
      "Propulsion selects, tests, and integrates motors, propellers, batteries, and supporting systems to give each aircraft the performance its mission needs.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Section Lead", image: placeholderLead },
      { name: "Deputy Section Lead", image: placeholderLead },
    ],
    projects: [
      {
        name: "Motor Testing",
        description: "Characterising propulsion setups to understand thrust, efficiency, and thermal behaviour.",
        image: "/images/redback-projects/propulsion/propulsion-1.JPG",
      },
      {
        name: "Propeller Selection",
        description: "Matching propellers to aircraft constraints, endurance goals, and control authority needs.",
        image: "/images/redback-projects/propulsion/propulsion-2.JPG",
      },
      {
        name: "Power Integration",
        description: "Preparing propulsion hardware for dependable operation in aircraft and test environments.",
        image: placeholderProjectImages[0],
      },
    ],
  },
];

// getSectionBySlug returns the section data for a route segment.
export function getSectionBySlug(slug: string) {
  return sections.find((section) => section.slug === slug);
}

// getNextSection returns the cyclic next section for the bottom navigation panel.
export function getNextSection(currentSlug: string) {
  const currentIndex = sectionOrder.indexOf(currentSlug);
  const nextSlug = sectionOrder[(currentIndex + 1) % sectionOrder.length];

  return getSectionBySlug(nextSlug);
}
