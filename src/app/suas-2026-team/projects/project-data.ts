export type KeyDesignDecision = {
  title: string;
  body: string;
};

export type Project = {
  name: string;
  slug: string;
  summary: string;
  leadLabel?: "Team lead" | "Team leads" | "Pilots";
  leads?: string[];
  memberLabel?: "Team members";
  members?: string[];
  keyDecisions: KeyDesignDecision[];
  testingProcess?: string;
  images: string[];
};

export const placeholderImage =
  "linear-gradient(135deg, rgba(0,74,173,0.95), rgba(0,31,73,0.95) 48%, rgba(0,0,0,0.98))";

export const projects: Project[] = [
  {
    name: "Upper Management",
    slug: "upper-management",
    summary:
      "Sets the strategic, technical and operational direction for Redback, coordinating the specialised teams and ensuring the aircraft develops as one integrated competition platform.",
    leadLabel: "Team leads",
    leads: [
      "Ethan Liberman — Team Lead",
      "James Morton — Chief Engineer",
      "Oliver Bilston — Chief Operating Officer",
    ],
    keyDecisions: [],
    images: [],
  },
  {
    name: "Aerostructures",
    slug: "aerostructures",
    summary:
      "Aerostructures develops and manufactures Redback's airframe, creating a lightweight and mission-specific platform capable of meeting the performance requirements of the SUAS competition.",
    leadLabel: "Team lead",
    leads: ["Lochlan Challis"],
    memberLabel: "Team members",
    members: ["Sota Kawasaki"],
    keyDecisions: [
      {
        title: "Carbon-fibre airframe",
        body: "Redback's endurance requirements demanded an airframe that was both lightweight and structurally strong. Carbon fibre was selected because of its strength-to-weight performance and the team's extensive experience manufacturing composite structures.",
      },
      {
        title: "3D-printed mounting components",
        body: "The comparatively low loading placed on many mounting components made additive manufacturing a practical option. It supports rapid design iteration while allowing replacement parts to be manufactured quickly during maintenance and repair.",
      },
    ],
    images: [],
  },
  {
    name: "DNA",
    slug: "dna",
    summary:
      "DNA provides real-time obstacle avoidance and supports autonomous mission functions, including diversion from the planned mission route and the aircraft's return to its original mission.",
    leadLabel: "Team lead",
    leads: ["Folger Kong"],
    keyDecisions: [
      {
        title: "Receding-horizon motion planning",
        body: "DNA adopted a classical, first-principles approach to generating dynamically feasible trajectories in real time. Receding-horizon planning predicts the aircraft's future motion and selects the immediate action that best supports safe obstacle avoidance.",
      },
      {
        title: "Companion-computer control",
        body: "The system asserts control through a companion computer while the aircraft operates in guided mode, allowing position, velocity and acceleration setpoints to be issued. Control can be revoked immediately through a flight-mode switch, preserving a direct safety override.",
      },
    ],
    images: [],
  },
  {
    name: "Flight Operations",
    slug: "flight-ops",
    summary:
      "Flight Operations takes Redback from design into real-world testing, identifying practical improvements that increase the aircraft's safety, performance and reliability.",
    leadLabel: "Team leads",
    leads: ["Alexi Rampono Kelly", "Alistair McLennan", "Tom Machin"],
    memberLabel: "Team members",
    members: [
      "Nicholas Stringer",
      "Saskia Milne",
      "Sabina Bodeit",
      "Johan Joshi",
      "Sam Evans",
      "Ellena Glenk",
      "Hannan Barnes",
      "Harshil Dobariya",
      "Rehaan Sachdeva",
      "Yu Xi Teng",
    ],
    keyDecisions: [
      {
        title: "Overhauled telemetry pipeline",
        body: "Redback was transitioned to the Herelink telemetry system to provide a reliable, high-bandwidth connection between the aircraft and ground operators. The previous system struggled when MAVLink data, video and control traffic shared the same connection, making a more robust telemetry pipeline necessary.",
      },
      {
        title: "Increased mission speed",
        body: "Although 7 m/s was identified as the most energy-efficient cruise speed, flight testing showed that increasing the endurance-phase speed to 17 m/s reduced the mission's overall battery cost by significantly shortening its duration. This also provides greater competition flexibility by allowing additional endurance laps or a repeated search phase.",
      },
    ],
    images: [],
  },
  {
    name: "Lifeline",
    slug: "lifeline",
    summary:
      "Lifeline designs and implements Redback's payload-delivery system, allowing the aircraft to deliver critical supplies safely to people on the ground.",
    leadLabel: "Team lead",
    leads: ["Chloe Shin"],
    memberLabel: "Team members",
    members: ["James McIntyre", "Zoe Bearup", "Valentino Vargetto", "Gavin Ng"],
    keyDecisions: [
      {
        title: "Passive braking",
        body: "The Lifeline system uses the kinetic energy generated during the payload's descent to regulate its speed rather than relying on an external power supply. This reduces demand on the aircraft's battery and supports greater mission endurance.",
      },
      {
        title: "Fail-safe release actuation",
        body: "A servo-driven mechanical release provides a simple and reliable PWM control path from the flight controller. The mechanism is designed so that the payload remains secured if logic power is lost.",
      },
    ],
    testingProcess:
      "The team bench-tests the control system and release mechanism as part of its pre-flight safety checks. Payload releases are then tested from the aircraft during flight to replicate mission conditions, while digital simulation supports the selection of components that control descent speed and delivery time.",
    images: [
      "/images/redback-projects/lifeline/lifeline-1.JPG",
      "/images/redback-projects/lifeline/lifeline-2.JPG",
    ],
  },
  {
    name: "Mission Management",
    slug: "mission-management",
    summary:
      "Mission Management centralises control of Redback and its onboard avionics systems within a single operator interface.",
    keyDecisions: [
      {
        title: "PyQt6 desktop application",
        body: "The team considered both web and desktop architectures. Because the system requires only one active client, a desktop application was selected and built with PyQt6, using technologies already familiar to the team and suited to rapid development.",
      },
      {
        title: "Communication broker",
        body: "An MQTT broker was selected to coordinate communication between Mission Management, DNA and Vision because it is widely used for connected systems and has extensive documentation. Protocol Buffers are used when communicating with DNA's Raspberry Pi, while Vision currently exchanges JSON messages.",
      },
    ],
    images: [],
  },
  {
    name: "Pilots",
    slug: "pilots",
    summary:
      "The pilots operate Redback during flight testing and translate the aircraft's technical capabilities into safe, repeatable flight procedures and mission execution.",
    leadLabel: "Pilots",
    leads: ["Tom Machin", "Adwik Ghosh", "Sean Ashton"],
    keyDecisions: [],
    images: [],
  },
  {
    name: "Propulsion",
    slug: "propulsion",
    summary:
      "Propulsion oversees the specification, installation and maintenance of Redback's commercial propulsion system, ensuring it can meet the endurance and performance requirements of the SUAS mission.",
    keyDecisions: [
      {
        title: "Quad-rotor motor configuration",
        body: "A quad-rotor configuration with one motor per boom was selected instead of a coaxial arrangement. This reduces power consumption and supports the competition endurance requirement, while retaining the proven reliability of a conventional quad-rotor layout.",
      },
      {
        title: "Custom propellers",
        body: "The efficiency limitations of readily available propellers created concerns around achievable flight time. Custom propulsion components were therefore selected to improve energy efficiency and address Redback's endurance requirements.",
      },
    ],
    images: [
      "/images/redback-projects/propulsion/propulsion-1.JPG",
      "/images/redback-projects/propulsion/propulsion-2.JPG",
    ],
  },
  {
    name: "Stack",
    slug: "stack",
    summary:
      "Stack designed and implemented Redback's electrical power-distribution circuits and communication pathways, connecting and supporting the aircraft's onboard systems.",
    leadLabel: "Team lead",
    leads: ["Tanvi Somvanshi"],
    memberLabel: "Team members",
    members: [
      "Eman Kashif",
      "George Dimitropoulos",
      "Georgie Thomas",
      "Ivan Ljubicic",
      "Lillian Nguyen",
    ],
    keyDecisions: [
      {
        title: "BEC power harness",
        body: "The power harness distributes regulated power from the main battery to systems including the flight controller, communications hardware and sensors. It protects sensitive electronics from voltage instability and allows each subsystem to receive reliable power without requiring separate batteries.",
      },
    ],
    images: [],
  },
];
