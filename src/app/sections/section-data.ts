import {
  portraits,
  type PortraitImage,
} from "@/app/our-team/data/portrait-assets";

export type SectionLead = {
  name: string;
  image: PortraitImage;
};

export type SectionMedia = {
  fit?: "cover" | "contain";
  position?: string;
  src: string;
};

export type SectionHeroMedia =
  | (SectionMedia & {
      alt: string;
      id: string;
      type: "image";
    })
  | (SectionMedia & {
      id: string;
      type: "video";
    });

export type SectionProject = {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
};

export type TeamSection = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  heroMedia: SectionHeroMedia[];
  leads: SectionLead[];
  nextSectionImage?: SectionMedia;
  projects: SectionProject[];
};

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
    shortDescription: "The team that designs and builds the body of our aircrafts.",
    description:
      "The Aerostructures team is responsible for the design, manufacture and maintenance of the Monash UAS airframes. The team utilises the latest composite technology and manufacturing techniques in order to produce aircraft that are lighter and stronger, while providing members of the team the opportunity to work with and learn about methods that are utilised more and more in the Aerospace industry.",
    heroMedia: [
      {
        id: "checking",
        type: "image",
        src: "/images/teams/aerostructures/hero/hero-checking.jpg",
        alt: "Aerostructures member checking hardware in the workshop",
        position: "50% 42%",
      },
      {
        id: "3d-printing",
        type: "video",
        src: "/images/teams/aerostructures/hero/hero-3d-printing.mov",
        position: "50% 50%",
      },
      {
        id: "holding-wing",
        type: "image",
        src: "/images/teams/aerostructures/hero/hero-holding-wing.png",
        alt: "Aerostructures member holding a carbon fibre wing section",
        position: "50% 54%",
      },
      {
        id: "working",
        type: "video",
        src: "/images/teams/aerostructures/hero/hero-working.mov",
        position: "50% 50%",
      },
      {
        id: "composites",
        type: "image",
        src: "/images/teams/aerostructures/hero/hero-composites.png",
        alt: "Aerostructures members working with composite material",
        position: "50% 56%",
      },
    ],
    leads: [
      { name: "Lochlan Challis", image: portraits.lochlanChallis },
      { name: "Chee Yong", image: portraits.cheeYong },
    ],
    nextSectionImage: {
      src: "/images/teams/aerostructures/next-component/next-section-avionics.jpg",
      position: "50% 50%",
    },
    projects: [
      {
        slug: "airframe-design",
        name: "Airframe Design",
        description: "Implementation of optimisation techniques and various aerodynamic design software that provide team members with the relevant skills and expertise needed to design an efficient and stable aircraft.",
        image: "/images/teams/aerostructures/projects/airframe-design.png",
        imagePosition: "50% 50%",
      },
      {
        slug: "composites",
        name: "Composites",
        description: "Constructing a UAV out of composite materials keeps the team consistent with Aerospace industry leaders. Carbon fibre, Fibreglass, Kevlar and composite core materials provide the necessary structure to withstand the aircrafts' forces, while keeping the aircrafts' weight at a minimum.",
        image: "/images/teams/aerostructures/projects/composites.png",
        imagePosition: "48% 54%",
      },
      {
        slug: "computational-fluid-dynamics",
        name: "Computational Fluid Dynamics",
        description: "Computational fluid dynamics (CFD) is a crucial step in ensuring the validity of the team's design. CFD also provides quantitative values used to evaluate and compare design choices.",
        image: "/images/teams/aerostructures/projects/cfd_updated.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "research-and-development",
        name: "Research and Development",
        description: "Research and development projects allow team members to explore new horizons and sprout innovative solutions. These tentative designs further future aircrafts' capabilities and enhance efficiency.",
        image: "/images/teams/aerostructures/projects/research-and-development.png",
        imagePosition: "50% 48%",
      },
      {
        slug: "destructive-testing",
        name: "Destructive Testing",
        description: "We use destructive testing combined with in house simulations to analyse our composite materials. This allows us to optimise our airframes, saving weight wherever possible. By deepening our understanding of the composite materials that are available to us we are able to develop new techniques for making more advanced aircraft.",
        image: "/images/teams/aerostructures/projects/destructive-testing.png",
        imagePosition: "50% 50%",
      },
      {
        slug: "rapid-prototyping",
        name: "Rapid Prototyping",
        description: "An extensive range of 3D printers allows Monash UAS to rapidly create physical models of designs to test and iterate as part of the engineering process.",
        image: "/images/teams/aerostructures/projects/rapid-prototyping.png",
        imagePosition: "50% 52%",
      },
    ],
  },
  {
    slug: "avionics",
    name: "Avionics",
    shortDescription: "The team that builds the brain and nervous system of our aircrafts.",
    description:
      "The Avionics section is responsible for the design and implementation of our aircraft onboard electrical, flight control and communications systems, as well as ground-based support hardware.",
    heroMedia: [
      {
        id: "tinkering",
        type: "image",
        src: "/images/teams/avionics/hero/hero-tinkering.png",
        alt: "Avionics member working on electronics at a bench",
        position: "32% 50%",
      },
      {
        id: "tinkering-2",
        type: "video",
        src: "/images/teams/avionics/hero/hero-tinkering-2.mov",
        position: "50% 50%",
      },
      {
        id: "examining",
        type: "image",
        src: "/images/teams/avionics/hero/hero-examining.png",
        alt: "Avionics members examining aircraft electronics in the field",
        position: "36% 52%",
      },
      {
        id: "redback-tinkering",
        type: "video",
        src: "/images/teams/avionics/hero/hero-redback-tinkering.mov",
        position: "50% 50%",
      },
      {
        id: "smiling",
        type: "image",
        src: "/images/teams/avionics/hero/hero-smiling.jpg",
        alt: "Avionics members holding a circuit board",
        position: "50% 48%",
      },
    ],
    leads: [
      { name: "Yogita Anand", image: portraits.yogitaAnand },
      { name: "Izaak Estandarte", image: portraits.izaakEstandarte },
    ],
    nextSectionImage: {
      src: "/images/teams/avionics/next-component/next-section-flight-operations.jpg",
      position: "50% 52%",
    },
    projects: [
      {
        slug: "vision",
        name: "Vision",
        description: "Vision is an advanced aerial rescue system designed to detect individuals in need and determine their precise GPS coordinates during rescue operations. Utilising high-resolution onboard cameras and AI-driven person detection through a convolutional neural network, Vision accurately identifies people and pinpoints their location with sub-meter accuracy. Real-time video transmission allows ground station operators to monitor and coordinate rescue efforts effectively. Additionally, Vision has mapping abilities, producing a HD image of a search area.  ",
        image: "/images/teams/avionics/projects/vision.png",
        imagePosition: "50% 50%",
      },
      {
        slug: "lifeline",
        name: "Lifeline",
        description: "Project Lifeline involves the development of a payload deployment system, which delivers items providing relief to individuals in need. The current Lifeline system is designed to lower a water bottle and light-emitting beacon from an altitude of 50m, utilising a resistive braking mechanism to ensure a safe, controlled deployment.",
        image: "/images/teams/avionics/projects/lifeline.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "stack",
        name: "Stack",
        description: "The avionics stack manages the power and communication channels of the plane. The stack team is responsible both designing and managing the wiring harness for the plane and well as performing pre-flight checks to ensure that it can take off and land safely.",
        image: "/images/teams/avionics/projects/stack.png",
        imagePosition: "50% 50%",
      },
      {
        slug: "detect-and-avoid",
        name: "Detect & Avoid (D&A)",
        description: "Detect and Avoid (D&A), launched in May 2024, focuses on creating and implementing a system capable of detecting other users of a shared airspace and preventing mid-air collisions. It integrates with Mission Management to calculate flight paths that avoid any potential collisions, ensuring the safety of the aircraft and any surrounding aircraft.",
        image: "/images/teams/avionics/projects/detect-and-avoid.png",
        imagePosition: "50% 50%",
      },
      {
        slug: "mission-management",
        name: "Mission Management",
        description: "DroneLink is UAS' custom-built, in-house mission management software tailored to UAS' needs. It automates the drone's mission, reducing the risk of human error. It features an intuitive general user interface that displays flight-critical information such as live aircraft speed, location of the drone, on-board camera feeds, battery data and much more, allowing our users to easily monitor and analyse the mission. This UI can be simultaneously run on multiple devices, with the data updating dynamically on all of them.",
        image: "/images/teams/avionics/projects/mission-management.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "power-distribution-board",
        name: "Power Distribution Board (PDB)",
        description: "The Power Distribution Board (PDB) is a custom Printed Circuit Board (PCB) that regulates and distributes power to the aircraft’s onboard avionics systems. It converts power from the main propulsion battery into stable voltage rails used by the flight computer, sensors, communication hardware and payload electronics. The board is designed to improve reliability, reduce wiring complexity and protect sensitive electronics from voltage drops, electrical noise and transient spikes caused by high-current propulsion loads. It includes regulated outputs, input protection, filtering, current monitoring and redundancy features to support safe and reliable flight.",
        image: "/images/teams/avionics/projects/power-distribution-board.jpg",
        imagePosition: "50% 50%",
      },
    ],
  },
  {
    slug: "flight-ops",
    name: "Flight Operations",
    shortDescription: "The team that flies our aircrafts and manages their missions.",
    description:
      "The Flight Operations section is responsible for the final construction and mission management of the Monash UAS' aircrafts. The team is involved in flight testing, integration and wiring of aerostructures and avionics components into the functional aircrafts, as well as the design of ground station equipment, procedures and piloting.",
    heroMedia: [
      {
        id: "ground-station",
        type: "image",
        src: "/images/teams/flight-operations/hero/hero-ground-station.jpg",
        alt: "Flight Operations members working at a ground station in the field",
        position: "48% 54%",
      },
      {
        id: "discussing",
        type: "video",
        src: "/images/teams/flight-operations/hero/hero-discussing.mov",
        position: "50% 50%",
      },
      {
        id: "monitor",
        type: "image",
        src: "/images/teams/flight-operations/hero/hero-monitor.png",
        alt: "Flight Operations ground station monitor and radio equipment",
        position: "62% 52%",
      },
      {
        id: "redback-in-air",
        type: "video",
        src: "/images/teams/flight-operations/hero/hero-redback-in-air.mov",
        position: "50% 50%",
      },
      {
        id: "night-work",
        type: "image",
        src: "/images/teams/flight-operations/hero/hero-night-work.jpg",
        alt: "Flight Operations members working on Redback at dusk",
        position: "54% 58%",
      },
    ],
    leads: [
      { name: "Alexi Rampono", image: portraits.alexiRampono },
      { name: "Alistair Mclennan", image: portraits.alastairMclennan },
    ],
    nextSectionImage: {
      src: "/images/teams/flight-operations/next-component/next-section-operations.jpg",
      position: "50% 50%",
    },
    projects: [
      {
        slug: "flight-days",
        name: "Flight Days",
        description: "While Flight Operations has a range of technical projects, we also have a huge amount of responsibility in organising flight testing, which includes running the days themselves as well as coordinating & conducting Pre Flight-Day Safety Checks (PFSCs) in the week leading up to a flight day. Every member of Flight Operations contributes to this process in addition to their project work.",
        image: "/images/teams/flight-operations/projects/flight-days.png",
        imagePosition: "50% 50%",
      },
      {
        slug: "ground-station",
        name: "Ground Station",
        description: "During flight tests, the ground station team monitors all systems on the aircraft through telemetry, interpreting the information and relaying it to pilots. Afterwards, analysis of the flight logs is conducted to extract critical metrics and information in order to better guide future developments. Currently, our ground station setup is being overhauled to be condensed to two redundant systems that can be deployed in seconds, each carryable in just a single hand.",
        image: "/images/teams/flight-operations/projects/ground-station.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "flight-analysis",
        name: "Flight Analysis",
        description: "Using a combination of dedicated in-flight tuning test platforms like the Fyrefly, manual stability analysis & simulation software, our Flight Analysis projects works to hone our ability to order the chaos of multi-rotors in any environment. These skills are vital to ensure the safe, stable & efficient flight of larger complex aircraft, especially when implementing autopilot procedures.",
        image: "/images/teams/flight-operations/projects/flight-analysis.png",
        imagePosition: "50% 50%",
      },
      {
        slug: "fyrefly",
        name: "Fyrefly",
        description: "The Fyrefly is an intentionally unstable tricopter to allow us to practice difficult tuning operations in a low-stakes environment. ",
        image: "/images/teams/flight-operations/projects/fyrefly.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "mosquito",
        name: "Mosquito",
        description: "The Mosquito is a small and simple aircraft that mimics the avionics setup of our larger aircraft to help us test experimental autopilot procedures.",
        image: "/images/teams/flight-operations/projects/mosquito.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "pilots",
        name: "Pilots",
        description: "The piloting team is responsible for the manual control of aircrafts and awareness of all systems on-board. Pilots are continuously communicating performance information to the development teams and are in charge of supervising all autonomous flights, always ready to take control in case of malfunction.",
        image: "/images/teams/flight-operations/projects/pilots.jpg",
        imagePosition: "50% 50%",
      },
    ],
  },
  {
    slug: "operations",
    name: "Operations",
    shortDescription: "The team that keeps everything running.",
    description:
      "Operations supports the people, planning, outreach, sponsorship, logistics, and communications that allow MUAS to deliver complex aircraft projects.",
    heroMedia: [
      {
        id: "events",
        type: "image",
        src: "/images/teams/operations/hero/hero-events.jpg",
        alt: "MUAS members at an operations event",
        position: "50% 58%",
      },
      {
        id: "sponsors",
        type: "image",
        src: "/images/teams/operations/hero/hero-sponsors.jpg",
        alt: "MUAS sponsor acknowledgement display",
        position: "50% 50%",
      },
      {
        id: "outreach",
        type: "image",
        src: "/images/teams/operations/hero/hero-outreach.jpg",
        alt: "MUAS outreach stall at an outdoor event",
        position: "50% 52%",
      },
      {
        id: "unveil",
        type: "video",
        src: "/images/teams/operations/hero/hero-unveil.mov",
        position: "50% 50%",
      },
      {
        id: "smiling",
        type: "image",
        src: "/images/teams/operations/hero/hero-smiling.jpg",
        alt: "Operations members smiling while reviewing camera footage",
        position: "42% 50%",
      },
      {
        id: "e-p",
        type: "image",
        src: "/images/teams/operations/hero/hero-e-p.jpg",
        alt: "Operations members flying model aircraft on campus",
        position: "50% 58%",
      },
    ],
    leads: [{ name: "Sumi Bandara", image: portraits.sumiBandara }],
    nextSectionImage: {
      src: "/images/teams/operations/next-component/next-section-propulsion.jpg",
      position: "50% 50%",
    },
    projects: [
      {
        slug: "marketing",
        name: "Marketing",
        description: "Managing social media, team storytelling, and public-facing updates across the season.",
        image: "/images/teams/operations/projects/marketing.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "sponsorship",
        name: "Sponsorship",
        description: "Building partner relationships and helping secure the resources needed for ambitious work.",
        image: "/images/teams/operations/projects/sponsorship.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "outreach",
        name: "Outreach",
        description: "Outreach involves the creation of interesting and informative STEM programs for primary and secondary students. The goal is to educate and build interest in the field of STEM through an engaging experience.",
        image: "/images/teams/operations/projects/outreach.jpg",
        imagePosition: "50% 50%",
      },
    ],
  },
  {
    slug: "propulsion",
    name: "Propulsion",
    shortDescription: "The team that makes our aircrafts fly.",
    description:
      "The propulsion section is dedicated to the testing, design and manufacture of MUAS propulsion systems. The section is focused on developing new and exciting capabilities within the team, including our own motors, controllers and propellers.",
    heroMedia: [
      {
        id: "han",
        type: "image",
        src: "/images/teams/propulsion/hero/hero-han.jpg",
        alt: "Propulsion member examining composite material in the workshop",
        position: "72% 50%",
      },
      {
        id: "motor-testing",
        type: "video",
        src: "/images/teams/propulsion/hero/hero-motor-testing.mov",
        position: "50% 50%",
      },
      {
        id: "examining",
        type: "image",
        src: "/images/teams/propulsion/hero/hero-examining.jpg",
        alt: "Propulsion member working with composite hardware",
        position: "34% 52%",
      },
      {
        id: "explaining",
        type: "video",
        src: "/images/teams/propulsion/hero/hero-explaining.mov",
        position: "50% 50%",
      },
      {
        id: "tinkering",
        type: "image",
        src: "/images/teams/propulsion/hero/hero-tinkering.jpg",
        alt: "Propulsion members working on electronics at a bench",
        position: "50% 46%",
      },
    ],
    leads: [
      { name: "Oliver Bassily", image: portraits.oliverBassily },
      { name: "Julian Nosiara", image: portraits.julianNosiara },
    ],
    nextSectionImage: {
      src: "/images/teams/propulsion/next-component/next-section-aerostructures.jpg",
      position: "50% 50%",
    },
    projects: [
      {
        slug: "motors",
        name: "Motors",
        description: "The motor sub-team is developing custom BLDC motors for our new aircraft. These motors are being developed to maximise the performance of our aircraft, and are designed to work closely with our ESC's and propellers.",
        image: "/images/teams/propulsion/projects/motors.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "electronic-speed-controllers",
        name: "Electronic Speed Controllers (ESCs)",
        description: "ESCs are the electrical component responsible for switching the phases on our electric motors, allowing our aircraft to adjust the motors speed. Our ESC sub-team is focused on developing our own ESCs which can integrate closely with our motors and auxiliary systems.",
        image: "/images/teams/propulsion/projects/electronic-speed-controllers.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "thrust-test-stand",
        name: "Thrust Test Stand",
        description: "The thrust test stand is our tool for testing all of our propulsion hardware in a safe and robust manner. This allows us to quantify the systems performance without risking one of our valuable aircraft.",
        image: "/images/teams/propulsion/projects/thrust-test-stand.jpg",
        imagePosition: "50% 50%",
      },
      {
        slug: "propellers",
        name: "Propellers",
        description: "The propeller team is working on developing custom propellers for our aircraft. These custom propellers allow us to fine tune the performance of our aircraft and motors.",
        image: "/images/teams/propulsion/projects/propellers.jpg",
        imagePosition: "50% 50%",
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
