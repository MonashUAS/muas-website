import {
  portraits,
  type PortraitImage,
} from "@/app/our-team/data/portrait-assets";

export type SectionLead = {
  name: string;
  image: PortraitImage;
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
const placeholderProjectImages = [
  "/images/homepage/hero/composites.jpg",
  "/images/homepage/hero/flight-monitor.jpg",
  "/images/homepage/quick-nav/our-drones.jpg",
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
    shortDescription: "The team that designs and builds the body of our aircrafts.",
    description:
      "The Aerostructures team is responsible for the design, manufacture and maintenance of the Monash UAS airframes. The team utilises the latest composite technology and manufacturing techniques in order to produce aircraft that are lighter and stronger, while providing members of the team the opportunity to work with and learn about methods that are utilised more and more in the Aerospace industry.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Lochlan Challis", image: portraits.lochlanChallis },
      { name: "Chee Yong", image: portraits.cheeYong },
    ],
    projects: [
      {
        name: "Airframe Design",
        description: "Implementation of optimisation techniques and various aerodynamic design software that provide team members with the relevant skills and expertise needed to design an efficient and stable aircraft.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Composites",
        description: "Constructing a UAV out of composite materials keeps the team consistent with Aerospace industry leaders. Carbon fibre, Fibreglass, Kevlar and composite core materials provide the necessary structure to withstand the aircrafts' forces, while keeping the aircrafts' weight at a minimum.",
        image: placeholderProjectImages[1],
      },
      {
        name: "Computational Fluid Dynamics",
        description: "Computational fluid dynamics (CFD) is a crucial step in ensuring the validity of the team's design. CFD also provides quantitative values used to evaluate and compare design choices.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Research and Development",
        description: "Research and development projects allow team members to explore new horizons and sprout innovative solutions. These tentative designs further future aircrafts' capabilities and enhance efficiency.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Destructive Testing",
        description: "We use destructive testing combined with in house simulations to analyse our composite materials. This allows us to optimise our airframes, saving weight wherever possible. By deepening our understanding of the composite materials that are available to us we are able to develop new techniques for making more advanced aircraft.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Rapid Prototyping",
        description: "An extensive range of 3D printers allows Monash UAS to rapidly create physical models of designs to test and iterate as part of the engineering process.",
        image: placeholderProjectImages[2],
      },
    ],
  },
  {
    slug: "avionics",
    name: "Avionics",
    shortDescription: "The team that builds the brain and nervous system of our aircrafts.",
    description:
      "The Avionics section is responsible for the design and implementation of our aircraft onboard electrical, flight control and communications systems, as well as ground-based support hardware.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Yogita Anand", image: portraits.yogitaAnand },
      { name: "Izaak Estandarte", image: portraits.izaakEstandarte },
    ],
    projects: [
      {
        name: "Vision",
        description: "Vision is an advanced aerial rescue system designed to detect individuals in need and determine their precise GPS coordinates during rescue operations. Utilising high-resolution onboard cameras and AI-driven person detection through a convolutional neural network, Vision accurately identifies people and pinpoints their location with sub-meter accuracy. Real-time video transmission allows ground station operators to monitor and coordinate rescue efforts effectively. Additionally, Vision has mapping abilities, producing a HD image of a search area.  ",
        image: placeholderProjectImages[1],
      },
      {
        name: "Lifeline",
        description: "Project Lifeline involves the development of a payload deployment system, which delivers items providing relief to individuals in need. The current Lifeline system is designed to lower a water bottle and light-emitting beacon from an altitude of 50m, utilising a resistive braking mechanism to ensure a safe, controlled deployment.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Stack",
        description: "The avionics stack manages the power and communication channels of the plane. The stack team is responsible both designing and managing the wiring harness for the plane and well as performing pre-flight checks to ensure that it can take off and land safely.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Detect & Avoid (D&A)",
        description: "Detect and Avoid (D&A), launched in May 2024, focuses on creating and implementing a system capable of detecting other users of a shared airspace and preventing mid-air collisions. It integrates with Mission Management to calculate flight paths that avoid any potential collisions, ensuring the safety of the aircraft and any surrounding aircraft.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Mission Management",
        description: "DroneLink is UAS' custom-built, in-house mission management software tailored to UAS' needs. It automates the drone's mission, reducing the risk of human error. It features an intuitive general user interface that displays flight-critical information such as live aircraft speed, location of the drone, on-board camera feeds, battery data and much more, allowing our users to easily monitor and analyse the mission. This UI can be simultaneously run on multiple devices, with the data updating dynamically on all of them.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Power Distribution Board (PDB)",
        description: "The Power Distribution Board (PDB) is a custom Printed Circuit Board (PCB) that regulates and distributes power to the aircraft’s onboard avionics systems. It converts power from the main propulsion battery into stable voltage rails used by the flight computer, sensors, communication hardware and payload electronics. The board is designed to improve reliability, reduce wiring complexity and protect sensitive electronics from voltage drops, electrical noise and transient spikes caused by high-current propulsion loads. It includes regulated outputs, input protection, filtering, current monitoring and redundancy features to support safe and reliable flight.",
        image: placeholderProjectImages[0],
      },
    ],
  },
  {
    slug: "flight-ops",
    name: "Flight Operations",
    shortDescription: "The team that flies our aircrafts and manages their missions.",
    description:
      "The Flight Operations section is responsible for the final construction and mission management of the Monash UAS' aircrafts. The team is involved in flight testing, integration and wiring of aerostructures and avionics components into the functional aircrafts, as well as the design of ground station equipment, procedures and piloting.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Alexi Rampono", image: portraits.alexiRampono },
      { name: "Alistair Mclennan", image: portraits.alastairMclennan },
    ],
    projects: [
      {
        name: "Flight Days",
        description: "While Flight Operations has a range of technical projects, we also have a huge amount of responsibility in organising flight testing, which includes running the days themselves as well as coordinating & conducting Pre Flight-Day Safety Checks (PFSCs) in the week leading up to a flight day. Every member of Flight Operations contributes to this process in addition to their project work.",
        image: placeholderProjectImages[1],
      },
      {
        name: "Ground Station",
        description: "During flight tests, the ground station team monitors all systems on the aircraft through telemetry, interpreting the information and relaying it to pilots. Afterwards, analysis of the flight logs is conducted to extract critical metrics and information in order to better guide future developments. Currently, our ground station setup is being overhauled to be condensed to two redundant systems that can be deployed in seconds, each carryable in just a single hand.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Flight Analysis",
        description: "Using a combination of dedicated in-flight tuning test platforms like the Fyrefly, manual stability analysis & simulation software, our Flight Analysis projects works to hone our ability to order the chaos of multi-rotors in any environment. These skills are vital to ensure the safe, stable & efficient flight of larger complex aircraft, especially when implementing autopilot procedures.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Fyrefly",
        description: "The Fyrefly is an intentionally unstable tricopter to allow us to practice difficult tuning operations in a low-stakes environment. ",
        image: placeholderProjectImages[0],
      },
      {
        name: "Mosquito",
        description: "The Mosquito is a small and simple aircraft that mimics the avionics setup of our larger aircraft to help us test experimental autopilot procedures.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Pilots",
        description: "The piloting team is responsible for the manual control of aircrafts and awareness of all systems on-board. Pilots are continuously communicating performance information to the development teams and are in charge of supervising all autonomous flights, always ready to take control in case of malfunction.",
        image: placeholderProjectImages[0],
      }
    ],
  },
  {
    slug: "operations",
    name: "Operations",
    shortDescription: "The team that keeps everything running.",
    description:
      "Operations supports the people, planning, outreach, sponsorship, logistics, and communications that allow MUAS to deliver complex aircraft projects.",
    heroVideo: placeholderVideo,
    leads: [{ name: "Sumi Bandara", image: portraits.sumiBandara }],
    projects: [
      {
        name: "Marketing",
        description: "Managing social media, team storytelling, and public-facing updates across the season.",
        image: "/images/homepage/quick-nav/our-team.jpg",
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
      {
        name: "Outreach",
        description: "Outreach involves the creation of interesting and informative STEM programs for primary and secondary students. The goal is to educate and build interest in the field of STEM through an engaging experience.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Recruitment",
        description: "Recruitment is responsible for the recruiting of new team members and maintaining the onboarding and off-boarding processes of the team.",
        image: placeholderProjectImages[2],
      },
      {
        name: "Graphic Design",
        description: "Graphic design involves the designing of marketing material for the team and helping Monash UAS in maintaining its uniqueness and recognisability.",
        image: placeholderProjectImages[2],
      },
    ],
  },
  {
    slug: "propulsion",
    name: "Propulsion",
    shortDescription: "The team that makes our aircrafts fly.",
    description:
      "The propulsion section is dedicated to the testing, design and manufacture of MUAS propulsion systems. The section is focused on developing new and exciting capabilities within the team, including our own motors, controllers and propellers.",
    heroVideo: placeholderVideo,
    leads: [
      { name: "Oliver Bassily", image: portraits.oliverBassily },
      { name: "Julian Nosiara", image: portraits.julianNosiara },
    ],
    projects: [
      {
        name: "Motors",
        description: "The motor sub-team is developing custom BLDC motors for our new aircraft. These motors are being developed to maximise the performance of our aircraft, and are designed to work closely with our ESC's and propellers.",
        image: "/images/redback-projects/propulsion/propulsion-1.JPG",
      },
      {
        name: "Electronic Speed Controllers (ESCs)",
        description: "ESCs are the electrical component responsible for switching the phases on our electric motors, allowing our aircraft to adjust the motors speed. Our ESC sub-team is focused on developing our own ESCs which can integrate closely with our motors and auxiliary systems.",
        image: "/images/redback-projects/propulsion/propulsion-2.JPG",
      },
      {
        name: "Thrust Test Stand",
        description: "The thrust test stand is our tool for testing all of our propulsion hardware in a safe and robust manner. This allows us to quantify the systems performance without risking one of our valuable aircraft.",
        image: placeholderProjectImages[0],
      },
      {
        name: "Propellers",
        description: "The propeller team is working on developing custom propellers for our aircraft. These custom propellers allow us to fine tune the performance of our aircraft and motors.",
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
