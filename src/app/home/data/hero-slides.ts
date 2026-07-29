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

// Homepage hero media for desktop viewports.
export const heroSlidesDesktop: HeroSlide[] = [
  {
    id: "peregrine",
    type: "image",
    src: "/images/homepage/hero/peregrine-fly.webp",
    alt: "Peregrine taking off",
  },
  {
    id: "redback-flying-1",
    type: "video",
    src: "/images/homepage/hero/redback-flying-1.mp4",
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
    id: "drone-footage",
    type: "video",
    src: "/images/homepage/hero/drone-footage.mp4",
  },
  {
    id: "o-week",
    type: "image",
    src: "/images/homepage/hero/o-week_updated.webp",
    alt: "MUAS members speaking with students at O-Week",
  },
  {
    id: "sunset-redback",
    type: "image",
    src: "/images/homepage/hero/redback3.webp",
    alt: "Redback quadcopter at sunset",
  },
  {
    id: "redback-flying-2",
    type: "video",
    src: "/images/homepage/hero/redback-flying-2.mp4",
  },
  {
    id: "tinkering",
    type: "image",
    src: "/images/homepage/hero/tinkering.webp",
    alt: "MUAS members working on aircraft hardware",
  },
  {
    id: "explaining",
    type: "video",
    src: "/images/homepage/hero/explaining.mp4",
  },
];

// Homepage hero media for mobile viewports (<768px).
export const heroSlidesMobile: HeroSlide[] = [
  {
    id: "peregrine-fly-mobile",
    type: "image",
    src: "/images/homepage/hero/peregrine-fly-mobile.webp",
    alt: "Peregrine taking off",
  },
  {
    id: "composites",
    type: "image",
    src: "/images/homepage/hero/composites.webp",
    alt: "MUAS composites work in progress",
  },
  {
    id: "redback-flying-1",
    type: "video",
    src: "/images/homepage/hero/redback-flying-1.mp4",
  },
  {
    id: "flight-monitor",
    type: "image",
    src: "/images/homepage/hero/flight-monitor.webp",
    alt: "MUAS members monitoring flight data",
  },
  {
    id: "tinkering",
    type: "image",
    src: "/images/homepage/hero/tinkering.webp",
    alt: "MUAS members working on aircraft hardware",
  },
  {
    id: "o-week",
    type: "image",
    src: "/images/homepage/hero/o-week_updated.webp",
    alt: "MUAS members speaking with students at O-Week",
  },
];

// Backward-compatible default export.
export const heroSlides = heroSlidesDesktop;
