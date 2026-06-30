export type DroneSpec = {
  label: string;
  value: string;
};

export type Drone = {
  slug: string;
  name: string;
  description: string[];
  heroImage?: string;
  features: DroneSpec[];
  dimensions: DroneSpec[];
  gallery?: Array<string | undefined>;
};

const placeholderGallery = [undefined, undefined, undefined];

export const drones: Drone[] = [
  {
    slug: "redback",
    name: "Redback",
    description: [
      "Redback is our latest competition aircraft (SUAS 2026), designed around rapid deployment and search-and-rescue mission capability.",
    ],
    heroImage: "/images/drones/redback.png",
    features: [
      { label: "Payload Capacity", value: "TBC" },
      { label: "Range", value: "TBC" },
      { label: "Design Max Speed", value: "TBC" },
    ],
    dimensions: [
      { label: "Wingspan", value: "TBC" },
      { label: "Length", value: "TBC" },
      { label: "Mass", value: "TBC" },
    ],
    gallery: placeholderGallery,
  },
  {
    slug: "peregrine",
    name: "Peregrine",
    description: [
      "Peregrine is a fixed-wing aircraft platform developed for NFC 2025, with efficient cruise, stable autonomous navigation, and long-range mission profiles.",
    ],
    heroImage: "/images/drones/peregrine.png",
    features: [
      { label: "Payload Capacity", value: "TBC" },
      { label: "Range", value: "TBC" },
      { label: "Design Max Speed", value: "TBC" },
    ],
    dimensions: [
      { label: "Wingspan", value: "TBC" },
      { label: "Length", value: "TBC" },
      { label: "Mass", value: "TBC" },
    ],
    gallery: placeholderGallery,
  },
  {
    slug: "ibis",
    name: "IBIS",
    description: [
      "IBIS is a MUAS development aircraft used to explore dependable flight systems, payload integration, and team flight operations.",
    ],
    features: [
      { label: "Payload Capacity", value: "TBC" },
      { label: "Range", value: "TBC" },
      { label: "Design Max Speed", value: "TBC" },
    ],
    dimensions: [
      { label: "Wingspan", value: "TBC" },
      { label: "Length", value: "TBC" },
      { label: "Mass", value: "TBC" },
    ],
    gallery: placeholderGallery,
  },
  {
    slug: "currawong",
    name: "Currawong",
    description: [
      "Currawong is a team aircraft focused on practical testing, flight validation, and refining MUAS' autonomous systems in the field.",
    ],
    features: [
      { label: "Payload Capacity", value: "TBC" },
      { label: "Range", value: "TBC" },
      { label: "Design Max Speed", value: "TBC" },
    ],
    dimensions: [
      { label: "Wingspan", value: "TBC" },
      { label: "Length", value: "TBC" },
      { label: "Mass", value: "TBC" },
    ],
    gallery: placeholderGallery,
  },
  {
    slug: "fyrefly",
    name: "Fyrefly",
    description: [
      "Fyrefly is part of the MUAS fleet, representing the team's continued experimentation with compact aircraft and autonomous flight capability.",
    ],
    features: [
      { label: "Payload Capacity", value: "TBC" },
      { label: "Range", value: "TBC" },
      { label: "Design Max Speed", value: "TBC" },
    ],
    dimensions: [
      { label: "Length", value: "TBC" },
      { label: "Width", value: "TBC" },
      { label: "Mass", value: "TBC" },
    ],
  },
  {
    slug: "mosquito",
    name: "Mosquito",
    description: [
      "Mosquito is a lightweight MUAS platform used for agile testing, prototyping, and quick iteration across the team's systems.",
    ],
    features: [
      { label: "Payload Capacity", value: "TBC" },
      { label: "Range", value: "TBC" },
      { label: "Design Max Speed", value: "TBC" },
    ],
    dimensions: [
      { label: "Length", value: "TBC" },
      { label: "Width", value: "TBC" },
      { label: "Mass", value: "TBC" },
    ],
  },
  {
    slug: "albatross",
    name: "Albatross",
    description: [
      "The Albatross is a hybrid power-lift airframe developed over a two-year period. Designed for search and rescue missions, it is capable of vertical takeoff and landing, and can transition into sustained forward flight using its 3 metre wingspan.",
      "This design combines the ability to hover in place, which is ideal for precise operations, and has the extended range and efficiency of a conventional fixed-wing aircraft.",
    ],
    heroImage: "/images/drones/albatross.png",
    features: [
      { label: "Payload Capacity", value: "2.5 kg" },
      { label: "Range", value: "26.6 km" },
      { label: "Max Flight Speed", value: "35 m/s (126 km/h)" },
      { label: "Min Flight Speed", value: "16 m/s (57 km/h)" },
    ],
    dimensions: [
      { label: "Wingspan", value: "3082 mm" },
      { label: "Length", value: "2195 mm" },
      { label: "Height", value: "405 mm" },
      { label: "Maximum Take-Off Weight", value: "19 kg" },
    ],
    gallery: [
      "/images/drones/albatross/albatross-1.png",
      "/images/drones/albatross/albatross-2.png",
      "/images/drones/albatross/albatross-3.png",
    ],
  },
  {
    slug: "hydra",
    name: "Hydra",
    description: [
      "Hydra is a DJI S800 Hexa-copter drone configured to carry both the Vision and Gimbal systems.",
    ],
    heroImage: "/images/drones/hydra.png",
    features: [
      { label: "Payload Capacity", value: "2.5 kg" },
      { label: "Range", value: "10 km" },
      { label: "Design Max Speed", value: "70 km/h" },
    ],
    dimensions: [
      { label: "Length", value: "1200 mm" },
      { label: "Width", value: "1200 mm" },
      { label: "Height", value: "350 mm" },
      { label: "Mass", value: "5 kg" },
    ],
  },
  {
    slug: "kraken",
    name: "Kraken",
    description: [
      "Kraken is a DJI S1000 Octo-copter drone configured to carry both the Lifeline and DNA systems.",
    ],
    heroImage: "/images/drones/kraken.png",
    features: [
      { label: "Payload Capacity", value: "6 kg" },
      { label: "Max Altitude Range", value: "500 m" },
      { label: "Design Max Speed", value: "55 km/h" },
    ],
    dimensions: [
      { label: "Length", value: "1200 mm" },
      { label: "Width", value: "1200 mm" },
      { label: "Height", value: "400 mm" },
      { label: "Mass", value: "4.4 kg" },
    ],
  },
];
