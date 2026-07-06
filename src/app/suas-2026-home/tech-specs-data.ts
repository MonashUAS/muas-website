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
  {
    label: "Map Resolution",
    value: "HD 1080 p",
    hoverValue: "HD 1080 p",
    caption: "1920p x 1080p ~6cm/pixel",
  },
  {
    label: "Payload Capacity",
    value: "14.5 oz",
    hoverValue: "410 g",
    caption: "Beacon + Water Bottle",
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
    ],
  },
  {
    title: "Lifeline",
    rows: [{ label: "Payload Delivery", value: "Tethered with electromagnetic braking" }],
  },
  {
    title: "Flight Operations",
    rows: [
      { label: "Flight Controller", value: "CubePilot Cube Orange+" },
      { label: "Autopilot Firmware", value: "Arducopter 4.6.3" },
    ],
  },
];
