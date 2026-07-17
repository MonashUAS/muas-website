export type TechSpecPanelMetric = {
  label: string;
  value: string;
};

export type TechSpecPanel = {
  navTitle: string;
  title: string;
  kicker?: string;
  subtitle: string;
  metrics: TechSpecPanelMetric[];
  image: {
    src: string;
    alt: string;
  };
};

export const techSpecPanels: TechSpecPanel[] = [
  {
    navTitle: "collapsed",
    title: "Aerostructure",
    kicker: "Collapsed State",
    subtitle: "Dimensions",
    image: {
      src: "/images/redback-tech-specs/collapsed.png",
      alt: "Redback aircraft collapsed state detail",
    },
    metrics: [
      { label: "Length", value: "22' (559mm)" },
      { label: "Width", value: "14' (356mm)" },
      { label: "Height", value: "9' (229mm)" },
    ],
  },
  {
    navTitle: "deployed",
    title: "Aerostructure",
    kicker: "Deployed State",
    subtitle: "Dimensions",
    image: {
      src: "/images/redback-tech-specs/deployed.png",
      alt: "Redback aircraft deployed state detail",
    },
    metrics: [
      { label: "Length", value: "36' (908mm)" },
      { label: "Width", value: "36' (908mm)" },
      { label: "Height", value: "14' (358mm)" },
    ],
  },
  {
    navTitle: "weight",
    title: "Aerostructure",
    subtitle: "Weight",
    image: {
      src: "/images/redback-tech-specs/weight.png",
      alt: "Redback aircraft weight specification detail",
    },
    metrics: [
      { label: "Total Weight", value: "20.2lbs (9.124kg)" },
      { label: "Maximum Takeoff Weight", value: "27.5lbs (12.488kg)" },
    ],
  },
  {
    navTitle: "performance",
    title: "Flight Performance",
    subtitle: "Range and Speed",
    image: {
      src: "/images/redback-tech-specs/flight.png",
      alt: "Redback aircraft flight performance detail",
    },
    metrics: [
      { label: "Total Operating Range", value: "--" },
      { label: "Maximum Flight Speed", value: "--" },
    ],
  },
  {
    navTitle: "power",
    title: "Stack and Propulsion",
    subtitle: "Power and Propulsion",
    image: {
      src: "/images/redback-tech-specs/propulsion.png",
      alt: "Redback propulsion system detail",
    },
    metrics: [
      { label: "Motor Model", value: "M6C10-150KV" },
      { label: "ESC Rating", value: "60A" },
      { label: "Battery Capacity", value: "599.4Wh (6 x 99.9Wh)" },
      { label: "Propellor Size", value: "21'" },
    ],
  },
  {
    navTitle: "vision",
    title: "Vision",
    subtitle: "Camera and Detection",
    image: {
      src: "/images/redback-tech-specs/vision.png",
      alt: "Redback vision system detail",
    },
    metrics: [
      { label: "Camera", value: "SIYI A8 Mini Gimbal Camera" },
      { label: "Ground Sample Distance", value: "-" },
      { label: "Object Detection Model", value: "-" },
      { label: "Map Resolution", value: "1920 x 1080p (~6cm/pixel)" },
    ],
  },
  {
    navTitle: "payload",
    title: "Lifeline",
    subtitle: "Payload Delivery",
    image: {
      src: "/images/redback-tech-specs/lifeline.png",
      alt: "Redback lifeline payload delivery detail",
    },
    metrics: [
      { label: "Payload Delivery System", value: "Tethered with electromagnetic braking" },
      { label: "Payload Capacity", value: "14.5oz (410g)" },
    ],
  },
  {
    navTitle: "controller",
    title: "Flight Operations",
    subtitle: "Controller",
    image: {
      src: "/images/redback-tech-specs/controller.png",
      alt: "Redback flight controller detail",
    },
    metrics: [
      { label: "Flight Controller", value: "CubePilot Cube Orange+" },
      { label: "Autopilot Firmware", value: "Arducopter 4.6.3" },
    ],
  },
];
