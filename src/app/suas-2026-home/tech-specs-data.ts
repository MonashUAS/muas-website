export type TechSpecCard = {
  label: string;
  value: string;
  hoverValue: string;
  caption: string;
};

export type TechSpecSystemRow = {
  label: string;
  value: string;
};

export type TechSpecSystemGroup = {
  title: string;
  rows: TechSpecSystemRow[];
};

export type TechSpecPanelMetric = {
  label: string;
  value: string;
  metricValue?: string;
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

const deployedImage = {
  src: "/images/redback-tech-specs/deployed.png",
  alt: "Redback aircraft deployed state detail",
};

export const techSpecCards: TechSpecCard[] = [
  {
    label: "Dimensions",
    value: "36' x 36' x 14'",
    hoverValue: "908 x 908 x 358 mm",
    caption: "Deployed State Dimensions",
  },
  {
    label: "Dimensions",
    value: "22' x 14' x 9'",
    hoverValue: "559 x 356 x 229 mm",
    caption: "Collapsed State Dimensions",
  },
  {
    label: "Total Weight",
    value: "20.2 lbs",
    hoverValue: "9.124 kg",
    caption: "All-up Weight",
  },
  {
    label: "MTOW",
    value: "27.5 lbs",
    hoverValue: "12.488 kg",
    caption: "Max. Takeoff Weight",
  },
  {
    label: "Range",
    value: "--",
    hoverValue: "--",
    caption: "Total Operating Range",
  },
  {
    label: "Max Flight Speed",
    value: "--",
    hoverValue: "--",
    caption: "Maximum Flight Speed",
  },
];

export const techSpecSystemGroups: TechSpecSystemGroup[] = [
  {
    title: "Propulsion",
    rows: [
      { label: "Motor Model", value: "M6C10-150KV" },
      { label: "ESC Rating", value: "60A" },
      { label: "Battery Capacity", value: "599.4Wh (6 x 99.9Wh)" },
      { label: "Propellor size", value: "21'" },
    ],
  },
  {
    title: "Vision",
    rows: [
      { label: "Camera", value: "SIYI A8 Mini Gimbal Camera" },
      { label: "Ground Sample Distance", value: "-" },
      { label: "Object Detection Model", value: "-" },
      { label: "Map Resolution", value: "1920p x 1080p ~6cm/pixel" },
    ],
  },
  {
    title: "Lifeline",
    rows: [
      { label: "Payload Delivery", value: "Tethered with electromagnetic braking" },
      { label: "Payload Capacity", value: "14.5oz (410g)" },
    ],
  },
  {
    title: "Flight Operations",
    rows: [
      { label: "Flight Controller", value: "CubePilot Cube Orange+" },
      { label: "Autopilot Firmware", value: "Arducopter 4.6.3" },
    ],
  },
];

export const techSpecPanels: TechSpecPanel[] = [
  {
    navTitle: "collapsed",
    title: "Aerostructure",
    kicker: "Collapsed State",
    subtitle: "Dimensions",
    image: deployedImage,
    metrics: [
      { label: "Length", value: "22'", metricValue: "559mm" },
      { label: "Width", value: "14'", metricValue: "356mm" },
      { label: "Height", value: "9'", metricValue: "229mm" },
    ],
  },
  {
    navTitle: "deployed",
    title: "Aerostructure",
    kicker: "Deployed State",
    subtitle: "Dimensions",
    image: deployedImage,
    metrics: [
      { label: "Length", value: "36'", metricValue: "908mm" },
      { label: "Width", value: "36'", metricValue: "908mm" },
      { label: "Height", value: "14'", metricValue: "358mm" },
    ],
  },
  {
    navTitle: "weight",
    title: "Aerostructure",
    subtitle: "Weight",
    image: deployedImage,
    metrics: [
      { label: "All-up Weight", value: "20.2lbs", metricValue: "9.124kg" },
      {
        label: "Max. Takeoff Weight",
        value: "27.5 lbs",
        metricValue: "12.488kg",
      },
    ],
  },
  {
    navTitle: "performance",
    title: "Flight Performance",
    subtitle: "Range and Speed",
    image: deployedImage,
    metrics: [
      { label: "Total Operating Range", value: "--" },
      { label: "Maximum Flight Speed", value: "--" },
    ],
  },
  {
    navTitle: "power",
    title: "Stack and Propulsion",
    subtitle: "Power and Propulsion",
    image: deployedImage,
    metrics: [
      { label: "Motor Model", value: "M6C10-150KV" },
      { label: "ESC Rating", value: "60A" },
      {
        label: "Battery Capacity",
        value: "599.4Wh",
        metricValue: "6 x 99.9Wh",
      },
      { label: "Propellor Size", value: "21'" },
    ],
  },
  {
    navTitle: "vision",
    title: "Vision",
    subtitle: "Camera and Detection",
    image: deployedImage,
    metrics: [
      { label: "Camera", value: "SIYI A8 Mini Gimbal Camera" },
      { label: "Ground Sample Distance", value: "-" },
      { label: "Object Detection Model", value: "-" },
      {
        label: "Map Resolution",
        value: "1920 x 1080p",
        metricValue: "~6cm/pixel",
      },
    ],
  },
  {
    navTitle: "payload",
    title: "Lifeline",
    subtitle: "Payload Delivery",
    image: deployedImage,
    metrics: [
      { label: "Payload Delivery System", value: "Tethered with electromagnetic braking" },
      { label: "Payload Capacity", value: "14.5oz", metricValue: "410g" },
    ],
  },
  {
    navTitle: "controller",
    title: "Flight Operations",
    subtitle: "Controller",
    image: deployedImage,
    metrics: [
      { label: "Flight Controller", value: "CubePilot Cube Orange+" },
      { label: "Autopilot Firmware", value: "Arducopter 4.6.3" },
    ],
  },
];
