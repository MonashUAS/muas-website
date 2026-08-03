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

const techSpecImageDir =
  "/images/suas initiative page/technical specifications";

export const techSpecPanels: TechSpecPanel[] = [
  {
    navTitle: "Dimensions",
    title: "Aerostructures",
    subtitle: "Collapsed and Deployed Dimensions",
    image: {
      src: `${techSpecImageDir}/Deployed.webp`,
      alt: "Redback aircraft deployed dimensions detail",
    },
    metrics: [
      { label: "Collapsed Length", value: "22' (559mm)" },
      { label: "Collapsed Width", value: "14' (356mm)" },
      { label: "Collapsed Height", value: "9' (229mm)" },
      { label: "Deployed Length", value: "36' (908mm)" },
      { label: "Deployed Width", value: "36' (908mm)" },
      { label: "Deployed Height", value: "14' (358mm)" },
    ],
  },
  {
    navTitle: "Airframe",
    title: "Aerostructures",
    subtitle: "Materials",
    image: {
      src: `${techSpecImageDir}/Airframe.webp`,
      alt: "Redback aircraft airframe materials detail",
    },
    metrics: [
      { label: "Main Frame", value: "Carbon Fibre" },
      { label: "Motor and Boom Mounts", value: "Aluminium" },
      { label: "Connectors", value: "PETG" },
    ],
  },
  {
    navTitle: "Weight",
    title: "Aerostructures",
    subtitle: "Weight",
    image: {
      src: `${techSpecImageDir}/Weight.webp`,
      alt: "Redback aircraft weight specification detail",
    },
    metrics: [
      { label: "Total Weight", value: "20.2lbs (9.124kg)" },
      {
        label: "Maximum Takeoff Weight",
        value: "27.5lbs (12.488kg)",
      },
    ],
  },
  {
    navTitle: "Performance",
    title: "Flight Performance",
    subtitle: "Range and Speed",
    image: {
      src: `${techSpecImageDir}/Performance.webp`,
      alt: "Redback aircraft flight performance detail",
    },
    metrics: [
      { label: "Total Operating Range", value: "~9.3mi (15km)" },
      { label: "Maximum Flight Speed", value: "~49.2mph (22m/s)" },
    ],
  },
  {
    navTitle: "Power",
    title: "Stack and Propulsion",
    subtitle: "Power and Propulsion",
    image: {
      src: `${techSpecImageDir}/Power.webp`,
      alt: "Redback propulsion system detail",
    },
    metrics: [
      { label: "Motor Model", value: "M6C10-150KV" },
      { label: "ESC Rating", value: "60A" },
      { label: "Propellor Size", value: "21'" },
      {
        label: "Propulsion Battery",
        value: "599.4Wh (6 × 99.9Wh)",
      },
      {
        label: "Avionics Battery",
        value: "32.56Wh (1 × 32.56Wh)",
      },
    ],
  },
  {
    navTitle: "Vision",
    title: "Vision",
    subtitle: "Camera and Detection",
    image: {
      src: `${techSpecImageDir}/Vision.webp`,
      alt: "Redback vision system detail",
    },
    metrics: [
      {
        label: "Camera",
        value: "SIYI A8 Mini Gimbal Camera",
      },
      {
        label: "Detection Model",
        value: "YOLOv8",
      },
      {
        label: "Ground Sample Distance",
        value: "6cm/pixel",
      },
      {
        label: "Map Resolution",
        value: "1920 × 1080p",
      },
      {
        label: "Mapping Software",
        value:
          "Microsoft Image Composite Editor (MICE) and Open Drone Model (ODM)",
      },
    ],
  },
  {
    navTitle: "Payload",
    title: "Lifeline",
    subtitle: "Payload Delivery",
    image: {
      src: `${techSpecImageDir}/Payload.webp`,
      alt: "Redback lifeline payload delivery detail",
    },
    metrics: [
      {
        label: "Tethered Payload Delivery System",
        value: "Electromagnetic Braking",
      },
      {
        label: "Payload Capacity",
        value: "14.5oz (410g)",
      },
    ],
  },
  {
    navTitle: "Controller",
    title: "Flight Operations",
    subtitle: "Controller",
    image: {
      src: `${techSpecImageDir}/Controller.webp`,
      alt: "Redback flight controller detail",
    },
    metrics: [
      {
        label: "Flight Controller",
        value: "CubePilot Cube Orange+",
      },
      {
        label: "Autopilot Firmware",
        value: "Arducopter 4.6.3",
      },
    ],
  },
];