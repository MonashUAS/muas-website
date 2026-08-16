/**
 * @file nfc-2025-data.ts
 * Data structures, static copy, and image assets for the NFC 2025 page.
 */

export interface CompGoal {
  id: string;
  text: string;
}

export interface DroneSpec {
  label: string;
  value: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  slug: string;
  body: string;
  image: string;
  alt: string;
}

export interface TakeawayCard {
  title: string;
  description: string;
  image: string;
  alt: string;
}

/**
 * External link for the NFC 2025 competition website.
 */
export const NFC_COMPETITION_URL = "https://neuesfliegen.de/competition/nfc-2025/";

/**
 * Hero background visuals.
 */
export const heroImages = {
  desktop: "/images/homepage/hero/peregrine-fly.webp",
  mobile: "/images/homepage/hero/peregrine-fly-mobile.webp",
};

/**
 * Competition summary text and bullet points.
 */
export const competitionSummary = {
  compTitle: "The Competition",
  compBody:
    "The New Flying Competition (NFC) is a prestigious international drone design and build competition for university students, held biennially in Hamburg, Germany. Since its launch in 2016, NFC has become a globally recognised event that challenges the brightest minds in engineering and robotics to develop the next generation of drone technology.",
  goalsTitle: "Competition Goals",
  goals: [
    "To design and build an aircraft with the most efficient electric propulsion system possible",
    "Carry the heaviest possible payload in the largest possible volume during the competition",
  ],
  significanceTitle: "The Significance of Our Entry",
  significanceBody:
    "Our entry into NFC 2025 marked a milestone for Monash Uncrewed Aerial Systems: our first ever international competition appearance. It was also our first competition in seven years, and in many ways it felt like we were stepping into the competition environment for the very first time as a team. Competing on the global stage was both a challenge and a privilege, and we are incredibly proud of what we achieved.",
  learnMoreLabel: "Learn more",
  groupImage: "/images/nfc-2025/nfc-group.webp",
};

/**
 * Peregrine Mk II specs for dimensions and key features.
 */
export const peregrineMkIISpecs = {
  title: "About Peregrine MK II",
  image: "/images/drones/peregrine.webp",
  description:
    "Featuring a 3.4 metre wingspan and a cruise-capable multirotor design, Peregrine Mk II is engineered for maximum endurance and range.",
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
};

/**
 * NFC 2025 competition timeline sequence.
 */
export const nfcTimelineItems: TimelineEvent[] = [
  {
    date: "Day 1 - Arrival",
    title: "Arrival",
    slug: "arrival",
    body: "Upon arrival, our team carried out all the pre-flight preparation. This included unpacking the aircraft from the crate and reassembling it, as well as all the pre-flight safety checks. We put wings on the fuse, made sure all components were wired correctly, and that all the electrical testing were operating as needed.",
    image: "/images/nfc-2025/timeline/timeline-arrival.webp",
    alt: "MUAS team unpacking and assembling Peregrine Mk II at Hamburg airfield",
  },
  {
    date: "Day 2 - Scrutineering",
    title: "Safety Scrutineering",
    slug: "scrutineering",
    body: "To ensure safe days of flying, The aircraft was assessed by the judges to determine its safety to fly, appropriate weight and balance, and its compliance with the competition regulations. We passed this without any issues!",
    image: "/images/nfc-2025/timeline/timeline-scrutineering.webp",
    alt: "Judges inspecting the Peregrine Mk II airframe for safety compliance",
  },
  {
    date: "Day 3 - Flying Day 1",
    title: "Manoeuvre Day 1",
    slug: "manoeuvre-day-1",
    body: "This was the very first day of flying! Everyone made their way to the airfield to prepare their aircraft for flight. Thanks to our Safety Check processes, UAS was consistently ready first. Each team was assigned a block in which they could fly, where they were given multiple attempts to complete the full competition run. This included runs at low speed, high speed, turns, glide performance, 3G manoeuvring, and other manoeuvres. We unfortunately had our first crash early on this day, but the team went back to the workshop with determination to repair it.",
    image: "/images/nfc-2025/timeline/timeline-day-1.webp",
    alt: "Peregrine Mk II on the runway preparing for flight attempts",
  },
  {
    date: "Day 4 - Flying Day 2",
    title: "Manoeuvre Day 2",
    slug: "manoeuvre-day-2",
    body: "After a long night repairing the aircraft, the team was given another opportunity to complete all the competition runs on Manoeuvre Day 2. Once again, the team passed all the safety checks and arrived prepared with spare parts. Unfortunately, a secondary crash brought our competition to an early end. Originally, Manoeuvre Day 2 was to be followed by Manoeuvre Day 3, where the endurance flights would take place; however, due to the loss of the airframe, we were unable to continue.",
    image: "/images/nfc-2025/timeline/timeline-day-2.webp",
    alt: "Team performing pre-flight checks before Manoeuvre Day 2",
  },
  {
    date: "Day 5 - Ceremony",
    title: "Award Ceremony",
    slug: "award-ceremony",
    body: "At the conclusion of the competition, the final results were announced. The Polish team secured first place, and MUAS achieved an impressive 6th place overall. Despite the setbacks, our team had a wonderful time at the competition, learned a lot from the other outstanding teams, and was incredibly proud of our efforts and achievements!",
    image: "/images/nfc-2025/timeline/timeline-award.webp",
    alt: "MUAS team celebrating at the NFC 2025 award ceremony in Hamburg",
  },
  {
    date: "Post Competition",
    title: "Post NFC",
    slug: "post-nfc",
    body: "NFC came to an end after a long, but rewarding journey. The team packed up the aircraft, which was picked up by a ship to return home. The team spent some days enjoying some time travelling around, relaxing after working incredibly hard for this competition! Soon after, they returned to Melbourne!",
    image: "/images/nfc-2025/timeline/timeline-post.webp",
    alt: "Team members travelling and celebrating after completing NFC 2025",
  },
];

/**
 * Key takeaways copy and card data. Uses nfc-group.webp as placeholder per instruction.
 */
export const keyTakeawaysData = {
  heading: "Key Takeaways",
  subtext:
    "With our strong performance reflected in the results, what we achieved far outweighs what we did not. NFC 2025 has given MUAS invaluable experience, international connections, and renewed focus. We return to Australia energised, inspired, and ready to take on another world class competition.",
  cards: [
    {
      title: "Our Strength",
      description:
        "Our biggest strength was our processes and checklists. They gave us consistency, structure, and confidence. They kept us calm under pressure, ensured we were always ready on time and allowed us to focus on flying rather than firefighting. That level of organisation was a real point of difference at the competition.",
      image: "/images/nfc-2025/nfc-group.webp",
      alt: "MUAS team members at NFC 2025",
    },
    {
      title: "Lessons Learned",
      description:
        "Several teams showed the power of technical simplicity: simpler geometries and smart use of off-the-shelf components over custom subsystems. Fewer parts meant fewer failure points and faster integration.",
      image: "/images/nfc-2025/nfc-group.webp",
      alt: "Aircraft inspection at NFC 2025",
    },
    {
      title: "Future Direction",
      description:
        "Peregrine Mk-II was ambitious, and that ambition showed in its complexity. While the airframe and design choices were solid, we have learned lessons in opting for simpler solutions and focusing innovation more strategically where it adds the most value.",
      image: "/images/nfc-2025/nfc-group.webp",
      alt: "Peregrine Mk II airframe overview",
    },
  ],
};

/**
 * Next section teaser for SUAS 2026. Uses nfc-group.webp as placeholder per instruction.
 */
export const nextSuasData = {
  title: "Next: SUAS 2026",
  subtitle:
    "Armed with international experience and key lessons from Hamburg, MUAS is setting its sights on the 2026 Student Uncrewed Aerial Systems Competition.",
  image: "/images/suas-team-page/hero/hero-redback.webp",
  alt: "Redback aircraft flying low over a grass field",
  ctaText: "Discover Redback",
  ctaHref: "/suas-2026-home",
};
