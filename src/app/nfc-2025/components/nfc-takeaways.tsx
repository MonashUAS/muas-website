"use client";

import Image from "next/image";
import { headerContentContainerClass } from "@/global-components/layout/sidebar/navbar-classes";
import { keyTakeawaysData } from "../nfc-2025-data";

/**
 * Renders the Key Takeaways section featuring heading, subtext summary,
 * and three benefit-style info cards detailing Our Strength, Lessons Learned, and Future Direction.
 */
export function NFCTakeaways() {
  return (
    <section
      id="key-takeaways"
      className="relative flex min-h-[100svh] scroll-mt-20 flex-col justify-center overflow-hidden bg-[linear-gradient(145deg,#02040a_0%,#001126_46%,#001f49_100%)] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(84,134,200,0.18),transparent_30%),radial-gradient(circle_at_84%_64%,rgba(0,74,173,0.2),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:86px_86px] opacity-25" />

      <div className={`${headerContentContainerClass} relative flex flex-col gap-10 lg:gap-12`}>
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.9] tracking-[-0.05em]">
            {keyTakeawaysData.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-b1 leading-relaxed text-blue-50 sm:text-subtitle">
            {keyTakeawaysData.subtext}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {keyTakeawaysData.cards.map((card) => (
            <div
              key={card.title}
              className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-white/12 bg-white/[0.07] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-md sm:rounded-[1.75rem]"
            >
              <div className="p-5 sm:p-7 lg:p-6">
                <h3 className="text-subtitle font-bold leading-tight tracking-[-0.02em] text-white sm:text-h6">
                  {card.title}
                </h3>
                <p className="mt-3 text-b2 leading-relaxed text-blue-50/85 sm:mt-4 sm:text-b1">
                  {card.description}
                </p>
              </div>

              <div className="relative mt-auto h-48 overflow-hidden bg-blue-900 sm:h-64 lg:h-72">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.48)_100%)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
