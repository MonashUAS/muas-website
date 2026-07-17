export type TeamMember = {
  name: string;
  role: string;
  section: string;
  image: string;
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

const teamImage = (filename: string) => `/images/team/${filename}.png`;

const managementMembers: TeamMember[] = [
  {
    name: "Ethan Liberman",
    role: "Team Lead",
    section: "Management",
    image: teamImage("EthanLibermanTeamLead"),
    priority: 1,
  },
  {
    name: "James Morton",
    role: "Chief Engineer",
    section: "Management",
    image: teamImage("JamesMortonCheifEng"),
    priority: 2,
  },
  {
    name: "Oliver Bilston",
    role: "Chief Operating Officer",
    section: "Management",
    image: teamImage("OliverBilstonCOO"),
    priority: 3,
  },
  {
    name: "Luke Nicholson",
    role: "Safety",
    section: "Management",
    image: teamImage("Luke_SafetyOfficer"),
    priority: 4,
  },
  {
    name: "Aanika Quadros",
    role: "People & Culture",
    section: "Management",
    image: teamImage("Aanika"),
    priority: 5,
  },
  {
    name: "Connor Madigan",
    role: "Finance",
    section: "Management",
    image: teamImage("ConnorMadiganFinanceManager"),
    priority: 6,
  },
];

const aerostructuresMembers: TeamMember[] = [
  {
    name: "Lochlan Challis",
    role: "Aerostructures",
    section: "Aerostructures",
    image: teamImage("LochlanChallisaero"),
  },
  {
    name: "Chee Yong",
    role: "Aerostructures",
    section: "Aerostructures",
    image: teamImage("CheeYongAero"),
  },
];

const avionicsMembers: TeamMember[] = [
  {
    name: "Yogita Anand",
    role: "Avionics",
    section: "Avionics",
    image: teamImage("YogitaAnandAvionics"),
  },
  {
    name: "Izaak Estandarte",
    role: "Avionics",
    section: "Avionics",
    image: teamImage("IzaakEstandarteAvionics"),
  },
];

const operationsMembers: TeamMember[] = [
  {
    name: "Sumi Bandara",
    role: "Operations",
    section: "Operations",
    image: teamImage("SumiBandaraOps"),
  },
];

const propulsionMembers: TeamMember[] = [
  {
    name: "Oliver Bassily",
    role: "Propulsion",
    section: "Propulsion",
    image: teamImage("OliverBassilyProps"),
  },
  {
    name: "Julian Nosiara",
    role: "Propulsion",
    section: "Propulsion",
    image: teamImage("JulianNosiaraProps"),
  },
];

const flightOperationsMembers: TeamMember[] = [
  {
    name: "Alexi Rampono",
    role: "Flight Operations",
    section: "Flight Operations",
    image: teamImage("AlexiRamponoFlops"),
  },
  {
    name: "Alastair Mclennan",
    role: "Flight Operations",
    section: "Flight Operations",
    image: teamImage("AlastairMclennanFlops"),
  },
];

const leadPilotMembers: TeamMember[] = [
  {
    name: "Adwik Ghosh",
    role: "Lead Pilot",
    section: "Lead Pilots",
    image: teamImage("AdwikGhoshPilot"),
  },
  {
    name: "Tom Machin",
    role: "Lead Pilot",
    section: "Lead Pilots",
    image: teamImage("TomMachinLeadPilot"),
  },
];

const sortMembersByPriority = (members: TeamMember[]) => {
  return [...members].sort(
    (firstMember, secondMember) =>
      (firstMember.priority ?? 999) - (secondMember.priority ?? 999),
  );
};

const orderedManagementMembers = sortMembersByPriority(managementMembers);

const allTeamMembers: TeamMember[] = [
  ...orderedManagementMembers,
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
      "Meet the 2025 leaders responsible for strategy, engineering, operations, safety, aircraft development and flight delivery across Monash UAS. Together, they coordinate the complete aircraft lifecycle and support more than 100 members across the team.",
    members: allTeamMembers,
  },
  {
    id: "management",
    label: "Management",
    description:
      "Our Management Team leads the club and sets the direction for the year, ensuring everything runs smoothly and aligns with compliance requirements. They coordinate sections, oversee major decisions, hold team-wide meetings and keep the wider program focused on its shared priorities.",
    members: orderedManagementMembers,
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
