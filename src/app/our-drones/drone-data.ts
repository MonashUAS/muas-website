export type DroneSpec = {
  label: string;
  value: string;
};

export type DroneBanner = {
  text: string;
  buttonText: string;
  href: string;
};

export type Drone = {
  slug: string;
  name: string;
  description: string[];
  heroImage?: string;
  features: DroneSpec[];
  dimensions: DroneSpec[];
  gallery?: Array<string | undefined>;
  banner?: DroneBanner;
};

const placeholderGallery = [undefined, undefined, undefined];

export const drones: Drone[] = [
  {
    slug: "redback",
    name: "Redback",
    description: [
      "Redback is our latest competition aircraft (SUAS 2026), designed around rapid deployment and search-and-rescue mission capability.",
    ],
    heroImage: "/images/drones/redback.webp",
    banner: {
      text: "SUAS 2026 Submission:",
      buttonText: "Learn More",
      href: "/suas-2026-home",
    },
    features: [
      { label: "Payload Capacity", value: "0.5 kg" },
      { label: "Range", value: "15 km" },
      { label: "Max Flight Speed", value: "22 m/s" },
    ],
    dimensions: [
      { label: "Length", value: "908 mm" },
      { label: "Width", value: "908 mm" },
      { label: "Height", value: "358 mm" },
      { label: "Mass", value: "9.124 kg" },
      { label: "Maximum Take-Off Weight", value: "12.488 kg" },
    ],
    gallery: [
      "/images/drones/redback/redback-2.webp",
      "/images/drones/redback/redback-3.webp",
      "/images/drones/redback/redback-4.webp",
      "/images/drones/redback/redback-7.webp",
    ],
  },
  {
    slug: "ibis",
    name: "Ibis",
    description: [
      "Ibis is a MUAS development aircraft used to explore dependable flight systems, payload integration, and team flight operations.",
    ],
    heroImage: "/images/drones/ibis.webp",
    features: [
      { label: "Payload Capacity", value: "1 kg" },
    ],
    dimensions: [
      { label: "Wingspan", value: "2200 mm" },
      { label: "Length", value: "1605 mm" },
      { label: "Width", value: "2200 mm" },
      { label: "Mass", value: "6.8 kg" },
      { label: "Maximum Take-Off Weight", value: "7.8 kg" },
    ],
    gallery: [
      "/images/drones/ibis/ibis-1.webp",
      "/images/drones/ibis/ibis-2.webp",
      "/images/drones/ibis/ibis-3.webp",
      "/images/drones/ibis/ibis-4.webp",
    ],
  },
  {
    slug: "peregrine",
    name: "Peregrine Mk II",
    description: [
      "Featuring a 3.4 metre wingspan and a cruise-capable multirotor design, Peregrine Mk II is engineered for maximum endurance and range. The Peregrine Mk II had also recently debuted in the New Flying Competition 2025.",
    ],
    heroImage: "/images/drones/peregrine.webp",
    features: [
      { label: "Payload Capacity", value: "3.7 kg || 17L" },
      { label: "Range", value: "64 km" },
      { label: "Max Flight Speed", value: "45 m/s || 162 km/h" },
      { label: "Min Flight Speed", value: "12 m/s || 43 km/h" },
      { label: "Glide Ratio", value: "20" },
      { label: "Climb Angle", value: "80°" },
    ],
    dimensions: [
      { label: "Wingspan", value: "3400 mm" },
      { label: "Length", value: "1780 mm" },
      { label: "Height (Without Landing Gear)", value: "460 mm" },
      { label: "Height (With Landing Gear)", value: "835 mm" },
      { label: "Maximum Take-Off Weight", value: "15 kg" },
    ],
    gallery: [
      "/images/drones/peregrine/peregrine-1.webp",
      "/images/drones/peregrine/peregrine-2.webp",
      "/images/drones/peregrine/peregrine-4.webp",
      "/images/drones/peregrine/peregrine-5.webp",
      "/images/drones/peregrine/peregrine-6.webp",
      "/images/drones/peregrine/peregrine-7.webp",
      "/images/drones/peregrine/peregrine-8.webp",
      "/images/drones/peregrine/peregrine-9.webp",
    ],
  },
  {
    slug: "albatross",
    name: "Albatross",
    description: [
      "The Albatross is a hybrid power-lift airframe developed over a two-year period. Designed for search and rescue missions, it is capable of vertical takeoff and landing, and can transition into sustained forward flight using its 3 metre wingspan.",
      "This design combines the ability to hover in place, which is ideal for precise operations, and has the extended range and efficiency of a conventional fixed-wing aircraft.",
    ],
    heroImage: "/images/drones/albatross.webp",
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
      "/images/drones/albatross/albatross-1.webp",
      "/images/drones/albatross/albatross-2.webp",
      "/images/drones/albatross/albatross-3.webp",
      "/images/drones/albatross/albatross-5.webp",
      "/images/drones/albatross/albatross-6.webp",
      "/images/drones/albatross/albatross-7.webp",
      "/images/drones/albatross/albatross-8.webp",
      "/images/drones/albatross/albatross-9.webp",
    ],
  },
  {
    slug: "mosquito",
    name: "Mosquito",
    description: [
      "Mosquito is a lightweight MUAS platform used for agile testing, prototyping, and quick iteration across the team's systems.",
    ],
    heroImage: "/images/drones/mosquito.webp",
    features: [
      { label: "Payload Capacity", value: "0.7 kg" },
      { label: "Range", value: "2 km" },
      { label: "Max Flight Speed", value: "20 m/s" },
      { label: "Min Flight Speed", value: "0 m/s" },
      { label: "Design Max Speed", value: "20 m/s" },
    ],
    dimensions: [
      { label: "Length", value: "230 mm" },
      { label: "Width", value: "210 mm" },
      { label: "Height", value: "150 mm" },
      { label: "Mass", value: "1 kg" },
    ],
  },
  {
    slug: "hydra",
    name: "Hydra",
    description: [
      "Hydra is a DJI S800 Hexa-copter drone configured to carry both the Vision and Gimbal systems.",
    ],
    heroImage: "/images/drones/hydra.webp",
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
    heroImage: "/images/drones/kraken.webp",
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
