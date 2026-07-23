import {
  portraits,
  type PortraitImage,
} from "./portrait-assets";

export type TeamMemberImage = PortraitImage;

export type TeamMember = {
  name: string;
  role: string;
  section: string;
  image: TeamMemberImage;
  priority?: number;
};

export type TeamSection = {
  id: string;
  label: string;
  description: string;
  members: TeamMember[];
};

export const temporaryImage = {
  src: "/images/placeholder (to be replaced)/placeholder image.jpg",
  missionAlt: "Temporary placeholder for Monash UAS members working together",
};

export { defaultPortraitPosition } from "./portrait-assets";

const managementMembers: TeamMember[] = [
  {
    name: "Ethan Liberman",
    role: "Team Lead",
    section: "Management",
    image: portraits.ethanLiberman,
    priority: 1,
  },
  {
    name: "James Morton",
    role: "Chief Engineer",
    section: "Management",
    image: portraits.jamesMorton,
    priority: 2,
  },
  {
    name: "Oliver Bilston",
    role: "Chief Operating Officer",
    section: "Management",
    image: portraits.oliverBilston,
    priority: 3,
  },
];

const auxiliaryMembers: TeamMember[] = [
  {
    name: "Alice Barling",
    role: "Workshop Manager",
    section: "Auxiliary",
    image: portraits.aliceBarling,
    priority: 1,
  },
  {
    name: "James McIntyre",
    role: "People & Culture",
    section: "Auxiliary",
    image: portraits.jamesMcIntyre,
    priority: 2,
  },
  {
    name: "Claire Zhang",
    role: "IT Manager",
    section: "Auxiliary",
    image: portraits.claireZhang,
    priority: 3,
  },
  {
    name: "Luke Nicholson",
    role: "Safety Lead",
    section: "Auxiliary",
    image: portraits.lukeNicholson,
    priority: 4,
  },
  {
    name: "Connor Madigan",
    role: "Finance Officer",
    section: "Auxiliary",
    image: portraits.connorMadigan,
    priority: 5,
  },
];

const aerostructuresMembers: TeamMember[] = [
  {
    name: "Lochlan Challis",
    role: "Aerostructures",
    section: "Aerostructures",
    image: portraits.lochlanChallis,
  },
  {
    name: "Chee Yong",
    role: "Aerostructures",
    section: "Aerostructures",
    image: portraits.cheeYong,
  },
];

const avionicsMembers: TeamMember[] = [
  {
    name: "Yogita Anand",
    role: "Avionics",
    section: "Avionics",
    image: portraits.yogitaAnand,
  },
  {
    name: "Izaak Estandarte",
    role: "Avionics",
    section: "Avionics",
    image: portraits.izaakEstandarte,
  },
];

const operationsMembers: TeamMember[] = [
  {
    name: "Sumi Bandara",
    role: "Operations",
    section: "Operations",
    image: portraits.sumiBandara,
  },
];

const propulsionMembers: TeamMember[] = [
  {
    name: "Oliver Bassily",
    role: "Propulsion",
    section: "Propulsion",
    image: portraits.oliverBassily,
  },
  {
    name: "Julian Nosiara",
    role: "Propulsion",
    section: "Propulsion",
    image: portraits.julianNosiara,
  },
];

const flightOperationsMembers: TeamMember[] = [
  {
    name: "Alexi Rampono Kelly",
    role: "Flight Operations",
    section: "Flight Operations",
    image: portraits.alexiRampono,
  },
  {
    name: "Alastair Mclennan",
    role: "Flight Operations",
    section: "Flight Operations",
    image: portraits.alastairMclennan,
  },
];

const leadPilotMembers: TeamMember[] = [
  {
    name: "Adwik Ghosh",
    role: "Lead Pilot",
    section: "Lead Pilots",
    image: portraits.adwikGhosh,
  },
  {
    name: "Tom Machin",
    role: "Lead Pilot",
    section: "Lead Pilots",
    image: portraits.tomMachin,
  },
];

const sortMembersByPriority = (members: TeamMember[]) => {
  return [...members].sort(
    (firstMember, secondMember) =>
      (firstMember.priority ?? 999) - (secondMember.priority ?? 999),
  );
};

const orderedManagementMembers = sortMembersByPriority(managementMembers);
const orderedAuxiliaryMembers = sortMembersByPriority(auxiliaryMembers);

const allTeamMembers: TeamMember[] = [
  ...orderedManagementMembers,
  ...orderedAuxiliaryMembers,
  ...aerostructuresMembers,
  ...avionicsMembers,
  ...operationsMembers,
  ...propulsionMembers,
  ...flightOperationsMembers,
  ...leadPilotMembers,
];

export const teamSections: TeamSection[] = [
  {
    id: "all",
    label: "All",
    description:
      "Meet the 2026 leaders responsible for strategy, engineering, operations, safety, aircraft development and flight delivery across Monash UAS. Together, they coordinate the complete aircraft lifecycle and support more than 100 members across the team.",
    members: allTeamMembers,
  },
  {
    id: "management",
    label: "Management",
    description:
      "Our Management Team leads the team and sets the direction for the year, ensuring everything runs smoothly and aligns with compliance requirements. They coordinate sections, oversee major decisions, hold team-wide meetings and keep the wider program focused on its shared priorities.",
    members: orderedManagementMembers,
  },
  {
    id: "auxiliary",
    label: "Auxiliary",
    description:
      "Auxiliary management supports the team’s day-to-day operations across the workshop, people and culture, IT systems and safety. These roles keep facilities, people processes and compliance running so the wider team can focus on aircraft delivery.",
    members: orderedAuxiliaryMembers,
  },
  {
    id: "aerostructures",
    label: "Aerostructures",
    description:
      "Aerostructures leads the design and manufacture of the aircraft’s physical structure, balancing aerodynamic performance, strength, weight and manufacturability. The section works closely with propulsion, avionics and flight operations to turn engineering concepts into flight-ready airframes.",
    members: aerostructuresMembers,
  },
  {
    id: "avionics",
    label: "Avionics",
    description:
      "Avionics develops the onboard electronics, embedded systems, communications and payload integration that allow the aircraft to operate reliably and autonomously. The section connects hardware and software while supporting testing, troubleshooting and competition readiness.",
    members: avionicsMembers,
  },
  {
    id: "operations",
    label: "Operations",
    description:
      "Operations keeps the wider team coordinated through logistics, scheduling, documentation, events and internal communication. The section connects technical work with the people, resources and planning required to keep each project moving.",
    members: operationsMembers,
  },
  {
    id: "propulsion",
    label: "Propulsion",
    description:
      "Propulsion develops and validates the systems that generate thrust and power the aircraft through every stage of flight. The section supports component selection, integration, performance testing and safe operation alongside aerostructures and flight operations.",
    members: propulsionMembers,
  },
  {
    id: "flight-operations",
    label: "Flight Operations",
    description:
      "Flight Operations plans and runs safe, structured flight testing. The section manages procedures, field logistics, risk controls and test objectives so engineering changes can be evaluated under real operating conditions.",
    members: flightOperationsMembers,
  },
  {
    id: "lead-pilots",
    label: "Lead Pilots",
    description:
      "The pilot team is responsible for aircraft handling, pilot readiness and the execution of safe test and competition flights. They work closely with Flight Operations and the technical sections to provide feedback and ensure each aircraft is ready to fly.",
    members: leadPilotMembers,
  },
];
