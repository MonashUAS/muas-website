"use client";

import Image from "next/image";
import { peregrineMkIISpecs } from "../nfc-2025-data";

/**
 * Renders the About Peregrine MK II section.
 * Displays heading, featured aircraft image, text summary, and side-by-side spec cards
 * for dimensions and key features.
 */
export function NFCAboutPeregrine() {
  return (
    <section
      id="about-peregrine-mk-ii"
      className="relative flex min-h-[100svh] scroll-mt-20 flex-col justify-center overflow-hidden bg-[linear-gradient(145deg,#000714_0%,#001126_50%,#000000_100%)] py-12 text-white sm:py-16 lg:py-24"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,74,173,0.18),transparent_50%)]" />

      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white">
            {peregrineMkIISpecs.title}
          </h2>
        </div>

        {/* Aircraft Image Showcase */}
        <div className="relative mx-auto mt-8 flex max-w-4xl justify-center sm:mt-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={peregrineMkIISpecs.image}
              alt="Peregrine Mk II aircraft"
              fill
              sizes="(min-width: 1024px) 70vw, 100vw"
              className="object-contain object-center"
            />
          </div>
        </div>

        {/* Text Description */}
        <div className="mx-auto mt-6 max-w-3xl text-center sm:mt-8">
          <p className="text-b1 leading-relaxed text-blue-50/90 sm:text-subtitle sm:leading-relaxed">
            {peregrineMkIISpecs.description}
          </p>
        </div>

        {/* Side-by-Side Specs Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-14 lg:gap-10">
          {/* Key Features Card */}
          <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-8">
            <h3 className="text-h6 font-bold tracking-[-0.02em] text-blue-200 sm:text-h5">
              Key Features
            </h3>
            <dl className="mt-5 space-y-3.5 divide-y divide-white/10">
              {peregrineMkIISpecs.features.map((item) => (
                <div
                  key={`feat-${item.label}`}
                  className="flex items-center justify-between pt-3.5 first:pt-0"
                >
                  <dt className="text-b2 text-blue-100/75 sm:text-b1">
                    {item.label}
                  </dt>
                  <dd className="text-b2 font-bold text-white sm:text-b1">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Dimensions Card */}
          <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-8">
            <h3 className="text-h6 font-bold tracking-[-0.02em] text-blue-200 sm:text-h5">
              Dimensions
            </h3>
            <dl className="mt-5 space-y-3.5 divide-y divide-white/10">
              {peregrineMkIISpecs.dimensions.map((item) => (
                <div
                  key={`dim-${item.label}`}
                  className="flex items-center justify-between pt-3.5 first:pt-0"
                >
                  <dt className="text-b2 text-blue-100/75 sm:text-b1">
                    {item.label}
                  </dt>
                  <dd className="text-b2 font-bold text-white sm:text-b1">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
