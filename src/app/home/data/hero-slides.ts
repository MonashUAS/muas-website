export type HeroSlide =
  | {
      id: string;
      type: "image";
      src: string;
      alt: string;
    }
  | {
      id: string;
      type: "video";
      src: string;
    };

// Homepage hero media is maintained here. Keep the sequence as:
// 2 photos -> video -> 1 photo -> video -> 2 photos.
export const heroSlides: HeroSlide[] = [
  {
    id: "redback-flying-1",
    type: "video",
    src: "/images/homepage/hero/redback-flying-1.mp4",
  },
  {
    id: "redback-flying-2",
    type: "video",
    src: "/images/homepage/hero/redback-flying-2.mp4",
  },
  {
    id: "redback-flying-3",
    type: "video",
    src: "/images/homepage/hero/redback-flying-3.mp4",
  },
  {
    id: "redback-flying-4",
    type: "video",
    src: "/images/homepage/hero/redback-flying-4.mp4",
  },
  {
    id: "composites",
    type: "image",
    src: "/images/homepage/hero/composites.webp",
    alt: "MUAS composites work in progress",
  },
  {
    id: "flight-monitor",
    type: "image",
    src: "/images/homepage/hero/flight-monitor.webp",
    alt: "MUAS members monitoring flight data",
  },
  {
    id: "explaining",
    type: "video",
    src: "/images/homepage/hero/explaining.mp4",
  },
  {
    id: "o-week",
    type: "image",
    src: "/images/homepage/hero/o-week_updated.webp",
    alt: "MUAS members speaking with students at O-Week",
  },
  {
    id: "drone-footage",
    type: "video",
    src: "/images/homepage/hero/drone-footage.mp4",
  },
  {
    id: "sunset-redback",
    type: "image",
    src: "/images/homepage/hero/redback3.webp",
    alt: "Redback quadcopter at sunset",
  },
  {
    id: "tinkering",
    type: "image",
    src: "/images/homepage/hero/tinkering.webp",
    alt: "MUAS members working on aircraft hardware",
  },
];
