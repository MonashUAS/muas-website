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
    id: "composites",
    type: "image",
    src: "/images/homepage/hero/composites.jpg",
    alt: "MUAS composites work in progress",
  },
  {
    id: "flight-monitor",
    type: "image",
    src: "/images/homepage/hero/flight-monitor.jpg",
    alt: "MUAS members monitoring flight data",
  },
  {
    id: "explaining",
    type: "video",
    src: "/images/homepage/hero/explaining.mov",
  },
  {
    id: "o-week",
    type: "image",
    src: "/images/homepage/hero/o-week_updated.jpg",
    alt: "MUAS members speaking with students at O-Week",
  },
  {
    id: "drone-footage",
    type: "video",
    src: "/images/homepage/hero/drone-footage.mov",
  },
  {
    id: "sunset-redback",
    type: "image",
    src: "/images/homepage/hero/sunset-redback.png",
    alt: "Redback quadcopter at sunset",
  },
  {
    id: "tinkering",
    type: "image",
    src: "/images/homepage/hero/tinkering.jpg",
    alt: "MUAS members working on aircraft hardware",
  },
];
