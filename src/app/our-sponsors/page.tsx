import { PageHero } from "@/global-components/modules/page-hero";
import { SponsorGrid } from "@/global-components/modules/sponsor-grid";
import { CircleCheck } from "lucide-react";
import Link from "next/link";

const sponsorshipBenefits = [
  {
    title: "Access Student Talent",
    description:
      "Gain exclusive access to our team of students who are becoming the Engineers of tomorrow.",
  },
  {
    title: "Gain Marketing Exposure",
    description:
      "Boost your company presence with your logo on our official team polo shirts and across our social media.",
  },
  {
    title: "Support Engineering Innovation",
    description:
      "Contributes to the development of non-military uncrewed aerial systems.",
  },
];

export default function OurSponsorsPage() {
  return (
    <div>
      <PageHero
        src="/images/heading images/our-sponsors-hero.jpg"
        alt="MUAS team members working on the NFC Drone"
        heading="SPONSORSHIPS"
        objectPositionClassName="object-center sm:object-[center_45%]"
      />

      <section className="bg-blue-900 px-6 py-9 text-white sm:py-11">
        <div className="mx-auto max-w-3xl space-y-8 text-center text-b1 leading-relaxed sm:text-subtitle">
          <p>
            Our sponsors provide us with resources that greatly assist us in
            our performance and development as a team. They keep us innovating
            and flying!
          </p>
          <p>
            We sincerely thank every sponsor whose support makes our work possible.
          </p>
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

      <section className="bg-blue-900 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-5xl rounded bg-blue-50 px-4 py-8 shadow-[10px_10px_0_rgba(0,0,0,0.38)] sm:px-10 sm:py-12 lg:px-16">
          <h2 className="text-center text-h7 font-bold leading-tight tracking-[-0.02em] text-blue-900 sm:text-h4">
            Interested In Becoming a Sponsor?
          </h2>

          <div className="mx-auto mt-8 max-w-3xl space-y-6 sm:mt-10 sm:space-y-7">
            {sponsorshipBenefits.map((benefit) => {
              return (
                <div
                  key={benefit.title}
                  className="flex items-start gap-3 sm:gap-6"
                >
                  <CircleCheck
                    className="size-8 shrink-0 text-blue-500 sm:size-11"
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  <div className="pt-0.5">
                    <h3 className="text-subtitle font-bold text-blue-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-b1 leading-relaxed text-black-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <Link
              href="/contact-us"
              className="inline-flex min-h-11 items-center justify-center rounded bg-blue-500 px-6 py-3 text-b1 font-bold text-white transition-colors hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
            >
              Contact Us!
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
