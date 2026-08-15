import type { Metadata } from "next";
import { NewsletterCarousel } from "./newsletter-carousel";
import { newsletters } from "./newsletter-data";

export const metadata: Metadata = {
  title: "Newsletters | Monash Uncrewed Aerial Systems",
  description:
    "Explore Monash Uncrewed Aerial Systems newsletters and stay updated on team achievements, competitions, and technical advancements.",
};

/**
 * NewsletterPage renders the interactive 3D newsletter carousel and flipbook reader.
 */
export default function NewsletterPage() {
  return <NewsletterCarousel newsletters={newsletters} />;
}
