export type HeroSlide =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "video";
      src: string;
    };

// Homepage hero media is maintained here. Keep filenames URL-safe and order
// images/videos intentionally so the slideshow does not feel predictable.
export const heroSlides: HeroSlide[] = [
  {
    type: "image",
    src: "/images/homepage/composites.jpg",
    alt: "MUAS composites work in progress",
  },
  {
    type: "video",
    src: "/images/homepage/redback-flight.mov",
  },
  {
    type: "image",
    src: "/images/homepage/full-team-photo.jpg",
    alt: "MUAS team group portrait",
  },
  {
    type: "image",
    src: "/images/homepage/flight-day.jpg",
    alt: "MUAS team preparing aircraft before launch",
  },
  {
    type: "video",
    src: "/images/homepage/outreach-2.mov",
  },
  {
    type: "image",
    src: "/images/homepage/nfc-team.jpg",
    alt: "MUAS NFC team",
  },
  {
    type: "image",
    src: "/images/homepage/flight-monitor.jpg",
    alt: "MUAS members monitoring flight data",
  },
  {
    type: "image",
    src: "/images/homepage/outreach-1.jpg",
    alt: "MUAS outreach event",
  },
];
