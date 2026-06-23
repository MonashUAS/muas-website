import { SponsorGrid } from "@/global-components/modules/sponsor-grid";
import Image from "next/image";

export default function OurSponsorsPage() {
  return (
    <div>
      <section className="relative flex h-[320px] items-center justify-center overflow-hidden sm:h-[420px] lg:h-[520px]">
        <Image
          src="/images/heading images/our-sponsors.png"
          alt="MUAS team members working on the NFC Drone"
          fill
          priority
          sizes="(min-width: 68px) calc(100vw - 68px), 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-blue-900/45" />
        <h1 className="relative px-6 text-center text-h6 font-bold tracking-[-0.07em] text-white sm:text-h3 lg:text-h2">
          SPONSORSHIPS
        </h1>
      </section>

      <section className="bg-blue-900 px-6 py-9 text-white sm:py-11">
      <div className="mx-auto max-w-3xl space-y-8 text-center text-b1 leading-relaxed sm:text-subtitle">
          <p>
            Our sponsors provide us with resources that greatly assist us in
            our performance and development as a team. They keep us innovating
            and flying!
          </p>
          <p>A huge thank you to all our sponsors.</p>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12"
        aria-labelledby="thanks-to-heading"
      >
      <h2
        id="thanks-to-heading"
        className="mb-6 text-center text-h6 font-bold text-blue-900 sm:mb-8 sm:text-h5"
      >
        Thanks To
      </h2>

        <SponsorGrid />
      </section>
    </div>
  );
}
