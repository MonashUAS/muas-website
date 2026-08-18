import type { Metadata } from "next";
import { ScrollRevealProvider } from "@/global-components/scroll-reveal";
import { NFCHero } from "./components/nfc-hero";
import { NFCSummary } from "./components/nfc-summary";
import { NFCVideo } from "./components/nfc-video";
import { NFCAboutPeregrine } from "./components/nfc-about-peregrine";
import { NFCTimeline } from "./components/nfc-timeline";
import { NFCTakeaways } from "./components/nfc-takeaways";
import { NFCGallery } from "./components/nfc-gallery";
import { NFCNextSUAS } from "./components/nfc-next-suas";

/**
 * Metadata configuration for the NFC 2025 page.
 */
export const metadata: Metadata = {
  title: "NFC 2025 | Monash Uncrewed Aerial Systems",
  description:
    "Explore Monash Uncrewed Aerial Systems' entry into the New Flying Competition (NFC) 2025 in Hamburg, Germany, featuring Peregrine Mk II.",
};

/**
 * Renders the complete NFC 2025 page.
 * Assembles all full-viewport sections wrapped in ScrollRevealProvider:
 * - Hero section (Peregrine MK II & NFC 2025 slideshow)
 * - Summary section (Competition requirements, goals, significance, Learn more link)
 * - Video section (Peregrine Mk II render showcase video)
 * - About Peregrine MK II section (aircraft overview & specs)
 * - At NFC 2025 section (timeline of competition events)
 * - Key Takeaways section (strengths, lessons learned, future direction)
 * - Highlights in Hamburg (competition photo carousel)
 * - Next: SUAS 2026 section (teaser banner)
 */
export default function NFC2025Page() {
  return (
    <ScrollRevealProvider className="min-h-full bg-black text-white">
      <NFCHero />
      <NFCSummary />
      <NFCVideo />
      <NFCAboutPeregrine />
      <NFCTimeline />
      <NFCTakeaways />
      <NFCGallery />
      <NFCNextSUAS />
    </ScrollRevealProvider>
  );
}
