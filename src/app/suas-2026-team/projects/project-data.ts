export type DesignDecision = {
  title: string;
  body: string;
};

export type Project = {
  name: string;
  slug: string;
  description: string;
  decisions: DesignDecision[];
  lead: string;
  members: string[];
  images: string[];
};

export const placeholderImage =
  "linear-gradient(135deg, rgba(0,74,173,0.95), rgba(0,31,73,0.95) 48%, rgba(0,0,0,0.98))";

export const projects: Project[] = [
  {
    name: "Upper Management",
    slug: "upper-management",
    description: "Project details are being finalised for the SUAS 2026 Redback team.",
    decisions: [
      { title: "Team Coordination", body: "Placeholder design decision to be updated." },
      { title: "Delivery Planning", body: "Placeholder design decision to be updated." },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [],
  },
  {
    name: "Aerostructures",
    slug: "aerostructures",
    description: "Project details are being finalised for the SUAS 2026 Redback team.",
    decisions: [
      { title: "Airframe Packaging", body: "Placeholder design decision to be updated." },
      { title: "Serviceability", body: "Placeholder design decision to be updated." },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [],
  },
  {
    name: "DNA",
    slug: "dna",
    description: "Project details are being finalised for the SUAS 2026 Redback team.",
    decisions: [
      { title: "Data Interfaces", body: "Placeholder design decision to be updated." },
      { title: "Testing Workflow", body: "Placeholder design decision to be updated." },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [],
  },
  {
    name: "Flight Ops",
    slug: "flight-ops",
    description: "Project details are being finalised for the SUAS 2026 Redback team.",
    decisions: [
      { title: "Mission Readiness", body: "Placeholder design decision to be updated." },
      { title: "Operational Safety", body: "Placeholder design decision to be updated." },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [],
  },
  {
    name: "Lifeline",
    slug: "lifeline",
    description:
      "Lifeline designed and implemented the payload delivery system that allows Redback to provide critical supplies to persons of need on the ground.",
    decisions: [
      {
        title: "Passive Braking",
        body: "The system leverages the kinetic energy of the payload descent to regulate speed without relying on external power.",
      },
      {
        title: "Release Actuation",
        body: "A servo-based release path keeps the payload attached during flight and releases it when commanded.",
      },
    ],
    lead: "Chloe Shin",
    members: ["TBD"],
    images: [
      "/images/redback-projects/lifeline/lifeline-1.JPG",
      "/images/redback-projects/lifeline/lifeline-2.JPG",
    ],
  },
  {
    name: "Mission Management",
    slug: "mission-management",
    description: "Project details are being finalised for the SUAS 2026 Redback team.",
    decisions: [
      { title: "Task Flow", body: "Placeholder design decision to be updated." },
      { title: "Ground Coordination", body: "Placeholder design decision to be updated." },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [],
  },
  {
    name: "Propulsion",
    slug: "propulsion",
    description:
      "Propulsion develops the Redback powertrain, balancing thrust, endurance, thermal limits, and maintainability for competition flight profiles.",
    decisions: [
      {
        title: "Thrust Margin",
        body: "The propulsion layout prioritises reliable lift authority across heavy payload and mission phases.",
      },
      {
        title: "Power Distribution",
        body: "Battery and ESC selection is managed around endurance, current handling, and practical field replacement.",
      },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [
      "/images/redback-projects/propulsion/propulsion-1.JPG",
      "/images/redback-projects/propulsion/propulsion-2.JPG",
    ],
  },
  {
    name: "Stack",
    slug: "stack",
    description: "Project details are being finalised for the SUAS 2026 Redback team.",
    decisions: [
      { title: "System Integration", body: "Placeholder design decision to be updated." },
      { title: "Reliability", body: "Placeholder design decision to be updated." },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [],
  },
  {
    name: "Vision",
    slug: "vision",
    description: "Project details are being finalised for the SUAS 2026 Redback team.",
    decisions: [
      { title: "Detection Pipeline", body: "Placeholder design decision to be updated." },
      { title: "Mapping Output", body: "Placeholder design decision to be updated." },
    ],
    lead: "TBD",
    members: ["TBD"],
    images: [],
  },
];
