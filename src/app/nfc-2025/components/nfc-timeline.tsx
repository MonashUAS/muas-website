"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { headerContentContainerClass } from "@/global-components/layout/sidebar/navbar-classes";
import { nfcTimelineItems, type TimelineEvent } from "../nfc-2025-data";

interface NFCTimelineItemProps {
  item: TimelineEvent;
  align: "left" | "right";
  index: number;
}

/**
 * Renders an individual timeline item card with alternating text and WebP image placement,
 * animated with scroll reveal.
 */
function NFCTimelineItem({ item, align, index }: NFCTimelineItemProps) {
  const isLeft = align === "left";
  const textOrderClass = isLeft
    ? "md:order-1 md:text-right"
    : "md:order-2 md:text-left";
  const imageOrderClass = isLeft ? "md:order-2" : "md:order-1";
  const delay = `${Math.min(index % 3, 2) * 90}ms`;

  return (
    <article
      data-suas-reveal=""
      data-timeline-reveal-item=""
      style={{ "--suas-reveal-delay": delay } as CSSProperties}
      className="relative isolate grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16"
    >
      {/* Content Text Column */}
      <div className={`${textOrderClass} relative z-10 min-w-0`}>
        <div className={`max-w-2xl ${isLeft ? "md:ml-auto" : ""}`}>
          <h3 className="text-h6 font-black leading-tight tracking-[-0.05em] text-white sm:text-h5">
            {item.title}
          </h3>
          <p className="mt-4 text-b1 leading-relaxed text-blue-50/84 sm:mt-5 sm:text-subtitle sm:leading-relaxed">
            {item.body}
          </p>
        </div>
      </div>

      {/* Image Media Column */}
      <div className={`${imageOrderClass} relative z-10 min-w-0`}>
        <div className="relative h-[240px] w-full overflow-hidden border border-blue-100/20 bg-blue-900 shadow-[0_34px_110px_rgba(0,0,0,0.46)] sm:h-[340px] lg:h-[400px]">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 44vw, calc(100vw - 40px)"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.28)_0%,rgba(0,31,73,0.05)_48%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,31,73,0.3)_100%)]" />
        </div>
      </div>
    </article>
  );
}

/**
 * Renders the At NFC 2025 timeline section detailing the journey from arrival to post competition.
 */
export function NFCTimeline() {
  return (
    <section
      id="at-nfc-2025"
      className="relative isolate min-h-[100svh] scroll-mt-20 overflow-hidden bg-[#001126] py-16 sm:py-24 lg:py-32"
    >
      <style>
        {`
          [data-suas-reveal] {
            opacity: 0;
            transform: translate3d(0, 4.5rem, 0) scale(0.96);
            transition:
              opacity 780ms ease,
              transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
            transition-delay: var(--suas-reveal-delay, 0ms);
            will-change: opacity, transform;
          }

          [data-suas-reveal].is-visible {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
            will-change: auto;
          }

          @media (prefers-reduced-motion: reduce) {
            [data-suas-reveal] {
              opacity: 1;
              transform: none;
              transition: none;
            }
          }

          @media (scripting: none) {
            [data-suas-reveal] {
              opacity: 1;
              transform: none;
            }
          }
        `}
      </style>
      {/* Dark Gradient Background */}
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#000000_0%,#001126_42%,#000611_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_16%,rgba(0,74,173,0.22),transparent_38%),radial-gradient(circle_at_66%_54%,rgba(84,134,200,0.12),transparent_30%)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:92px_92px] opacity-50" />

      <div className={headerContentContainerClass}>
        <h2 className="max-w-[18ch] text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white">
          At NFC 2025
        </h2>

        <div className="relative mt-14 sm:mt-16 lg:mt-20">
          <div className="space-y-16 md:space-y-20 lg:space-y-24">
            {nfcTimelineItems.map((item, index) => (
              <NFCTimelineItem
                key={`${item.slug}-${index}`}
                item={item}
                align={index % 2 === 0 ? "left" : "right"}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
