"use client";

import Image from "next/image";
import Link from "next/link";
import { competitionSummary, NFC_COMPETITION_URL } from "../nfc-2025-data";

/**
 * Renders the competition summary section detailing NFC 2025 requirements, goals,
 * significance of entry, and an external link to the official competition site.
 */
export function NFCSummary() {
  return (
    <section
      id="nfc-summary"
      className="relative isolate flex min-h-[92svh] scroll-mt-20 items-center overflow-hidden bg-black-500 py-12 pb-8 text-white sm:py-16 sm:pb-10 lg:py-20 lg:pb-12"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_45%,rgba(0,74,173,0.18),transparent_38%)]" />

      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(480px,0.9fr)] lg:items-center lg:gap-16">
          {/* Text Left Column */}
          <div className="min-w-0 max-w-4xl space-y-8">
            <div>
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
                {competitionSummary.compTitle}
              </h2>
              <p className="mt-4 text-b1 leading-relaxed text-blue-50/85 sm:text-subtitle sm:leading-relaxed">
                {competitionSummary.compBody}
              </p>
            </div>

            <div>
              <h3 className="text-h6 font-bold tracking-[-0.02em] text-blue-100 sm:text-h5">
                {competitionSummary.goalsTitle}
              </h3>
              <ul className="mt-3 list-disc space-y-2.5 pl-5 marker:text-blue-200 text-b1 leading-relaxed text-blue-50/85 sm:text-subtitle">
                {competitionSummary.goals.map((goal, idx) => (
                  <li key={`goal-${idx}`}>{goal}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-h6 font-bold tracking-[-0.02em] text-blue-100 sm:text-h5">
                {competitionSummary.significanceTitle}
              </h3>
              <p className="mt-3 text-b1 leading-relaxed text-blue-50/85 sm:text-subtitle sm:leading-relaxed">
                {competitionSummary.significanceBody}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={NFC_COMPETITION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-b1 font-bold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-12 sm:px-7 sm:py-3"
              >
                {competitionSummary.learnMoreLabel}
              </Link>
            </div>
          </div>

          {/* Image Right Column */}
          <div className="relative flex min-w-0 items-center justify-center lg:justify-end">
            <div className="relative h-[300px] w-full overflow-hidden rounded-none border border-blue-100/20 bg-blue-900 shadow-[0_34px_110px_rgba(0,0,0,0.46)] sm:h-[420px] lg:h-[min(560px,calc(100svh-10rem))] lg:[clip-path:polygon(5%_0,100%_0,100%_100%,0_100%)]">
              <div className="absolute -inset-8 bg-blue-500/15 blur-3xl" />

              <Image
                src={competitionSummary.groupImage}
                alt="MUAS team group photo at NFC 2025 competition in Hamburg"
                fill
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.28)_0%,rgba(0,31,73,0.05)_48%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,31,73,0.3)_100%)]" />
              <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />
              <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
