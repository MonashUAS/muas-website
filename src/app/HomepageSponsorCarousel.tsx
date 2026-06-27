"use client";

import Image from "next/image";
import { sponsorRows } from "@/global-components/modules/sponsor-grid";

// Reuse the sponsor page data so adding or removing sponsors only needs one
// data update in SponsorGrid. The duplicated array creates a seamless loop.
const sponsors = sponsorRows.flatMap((row) => row.sponsors);
const duplicatedSponsors = [...sponsors, ...sponsors];

export function HomepageSponsorCarousel() {
  return (
    <section
      className="overflow-hidden bg-white px-4 py-14 text-blue-900 sm:px-6 sm:py-16 lg:px-8"
      aria-labelledby="homepage-sponsors-heading"
    >
      <div className="mx-auto max-w-[1720px]">
        <h2
          id="homepage-sponsors-heading"
          className="text-center text-[clamp(1.5rem,3vw,3rem)] font-medium leading-none tracking-[-0.05em]"
        >
          Made Possible By
        </h2>

        <div
          className="group relative mt-10 overflow-hidden outline-none focus-visible:ring-1 focus-visible:ring-blue-900/40 sm:mt-12"
          tabIndex={0}
          aria-label="Sponsor logo carousel"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,#ffffff,rgba(255,255,255,0))] sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(270deg,#ffffff,rgba(255,255,255,0))] sm:w-28" />

          {/* The logo list is duplicated so the marquee can loop without a visible jump. */}
          <div className="flex w-max animate-sponsor-marquee items-center gap-12 py-4 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none sm:gap-16 lg:gap-24">
            {duplicatedSponsors.map((sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="flex h-24 w-44 shrink-0 items-center justify-center sm:h-28 sm:w-56 lg:h-32 lg:w-64"
              >
                <Image
                  src={sponsor.src}
                  alt={`${sponsor.name} logo`}
                  width={260}
                  height={128}
                  sizes="(min-width: 1024px) 16rem, (min-width: 640px) 14rem, 11rem"
                  className="max-h-full w-auto max-w-full object-contain opacity-90 transition-opacity duration-300 hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
