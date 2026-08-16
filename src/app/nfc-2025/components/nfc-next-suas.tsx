"use client";

import { NextDestinationLink } from "@/global-components/next-destination-link";
import { nextSuasData } from "../nfc-2025-data";

/**
 * Renders the Next: Redback / SUAS 2026 section using the shared NextDestinationLink component.
 * Features the CTA button text "Discover Redback" linking to the Redback home page.
 */
export function NFCNextSUAS() {
  return (
    <NextDestinationLink
      id="next-suas-2026"
      title="Next: SUAS 2026"
      description={nextSuasData.subtitle}
      ctaLabel="Discover Redback"
      href="/suas-2026-home"
      imageSrc={nextSuasData.image}
      imageAlt={nextSuasData.alt}
      imagePosition="50% 40%"
    />
  );
}
