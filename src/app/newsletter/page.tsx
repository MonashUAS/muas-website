import type { Metadata } from "next";
import { NewsletterShelf } from "./newsletter-shelf";
import { newsletters } from "./newsletter-data";

export const metadata: Metadata = {
  title: "Newsletters | Monash Uncrewed Aerial Systems",
  description:
    "Explore Monash Uncrewed Aerial Systems newsletters and stay updated on team achievements, competitions, and technical advancements.",
};

/**
 * NewsletterPage renders the interactive bookshelf layout and flipbook reader for MUAS newsletters.
 */
export default function NewsletterPage() {
  return <NewsletterShelf newsletters={newsletters} />;
}
