import { HomepageSponsorCarousel } from "@/app/home";
import Image from "next/image";
import Link from "next/link";

// Hero image for the Sponsor Us page. Update this path when replacing the
// sponsor-facing hero visual.
const sponsorHeroImage = "/images/sponsor us page/our-sponsors-hero.jpg";

// Sponsor benefit items and images are editable here when sponsor-facing
// priorities or page photography changes.
const sponsorBenefitItems = [
  {
    title: "Access Student Talent",
    description:
      "Connect with highly motivated students across engineering, computing, design, operations, and aerospace disciplines who are building real uncrewed aircraft systems.",
    image: "/images/sponsor us page/IMG_7527.JPG",
    alt: "MUAS students and industry visitors discussing an uncrewed aircraft in the workshop",
  },
  {
    title: "Gain Meaningful Exposure",
    description:
      "Showcase your brand across MUAS events, competitions, team apparel, digital channels, and public engagement activities.",
    image: "/images/sponsor us page/XT300347.JPG",
    alt: "MUAS presentation screen at a public team event",
  },
  {
    title: "Support Aerospace Innovation",
    description:
      "Help students design, manufacture, test, and fly autonomous aircraft for real-world engineering challenges and international competitions.",
    image: "/images/sponsor us page/DSC00686.JPG",
    alt: "MUAS student working on composite aerospace components in the workshop",
  },
];

// MUAS sponsorship impact metrics. Update this array when future sponsor
// reports or campaign metrics are ready to publish.
const sponsorImpactStats = [
  {
    value: "230+",
    label: "Recruitment applicants in 2025",
  },
  {
    value: "570+",
    label: "Event attendees in 2025",
  },
  {
    value: "2nd",
    label: "NFC 2025 design category",
  },
  {
    value: "SUAS 2026",
    label: "Redback competition campaign",
  },
];

export default function OurSponsorsPage() {
  return (
    <div>
      {/* Sponsor-focused hero shown at the top of the sponsors page. */}
      <section className="relative isolate overflow-hidden bg-black-500 text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_10%,rgba(0,74,173,0.34),transparent_30%),radial-gradient(circle_at_86%_58%,rgba(84,134,200,0.2),transparent_34%),linear-gradient(145deg,#000000_0%,#001126_46%,#001f49_100%)]" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:84px_84px] opacity-24" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.45),transparent)]" />

        <div className="mx-auto w-full max-w-[1720px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="grid gap-10 lg:min-h-[660px] lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1fr)] lg:items-center lg:gap-14">
            <div className="max-w-3xl">
              <h1 className="max-w-full break-words text-[clamp(3.75rem,12vw,9rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white">
                Sponsor Us
              </h1>
              <p className="mt-6 max-w-3xl text-b1 leading-relaxed text-blue-50 sm:text-subtitle">
                Join leading companies in supporting student-led aerospace
                innovation, hands-on engineering, and the next generation of
                drone technology. We sincerely thank our existing sponsors
                whose support makes our work possible.
              </p>

              <div className="mt-9 grid max-w-2xl grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 sm:gap-4 lg:mt-12">
                {sponsorImpactStats.map((stat) => {
                  return (
                    <div
                      key={stat.label}
                      className="min-w-0 rounded-xl border border-white/14 bg-white/[0.085] px-4 py-5 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-5 sm:py-6"
                    >
                      <p className="break-words text-h7 font-bold leading-tight text-white sm:text-h5">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-b2 leading-snug text-blue-100 sm:text-b1">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative min-w-0 lg:self-stretch">
              <div className="absolute -inset-8 bg-blue-500/18 blur-3xl" />
              <div className="relative h-full min-h-[230px] border border-blue-200/25 bg-blue-900/20 shadow-[0_32px_100px_rgba(0,0,0,0.5)] [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)] sm:min-h-[300px] lg:min-h-full">
                <div className="relative h-[230px] overflow-hidden bg-blue-900 sm:h-[300px] lg:h-full [clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]">
                  <Image
                    src={sponsorHeroImage}
                    alt="MUAS students preparing an uncrewed aircraft with sponsor logos visible"
                    fill
                    priority
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-cover object-[50%_52%]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.42)_0%,rgba(0,31,73,0.08)_48%,rgba(0,0,0,0.24)_100%),linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.48)_100%)]" />
                  <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />
                  <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomepageSponsorCarousel
        heading="Our 2026 Sponsors"
        headingId="thanks-to-heading"
      />

      <section className="relative overflow-hidden bg-[linear-gradient(145deg,#02040a_0%,#001126_46%,#001f49_100%)] px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(84,134,200,0.18),transparent_30%),radial-gradient(circle_at_84%_64%,rgba(0,74,173,0.2),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:86px_86px] opacity-25" />

        <div className="relative mx-auto grid max-w-[1720px] gap-10 lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[0.9] tracking-[-0.05em]">
              Why Sponsor MUAS?
            </h2>
            <p className="mt-5 max-w-xl text-b1 leading-relaxed text-blue-50 sm:text-subtitle">
              Partner with MUAS to support student-led aerospace engineering
              and the next generation of drone technology.
            </p>

            <Link
              href="/contact-us"
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded bg-white px-6 py-3 text-b1 font-bold text-blue-900 transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Become a Sponsor
            </Link>
          </div>

          <div className="space-y-5">
            {sponsorBenefitItems.map((benefit, index) => {
              return (
                <div
                  key={benefit.title}
                  className="group grid overflow-hidden rounded-[1.35rem] border border-white/12 bg-white/[0.07] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-md sm:grid-cols-[minmax(190px,0.42fr)_minmax(0,1fr)] sm:rounded-[1.75rem]"
                >
                  <div className="relative h-52 overflow-hidden bg-blue-900 sm:h-auto sm:min-h-64 sm:[clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
                    <Image
                      src={benefit.image}
                      alt={benefit.alt}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 38vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.48)_100%)]" />
                  </div>

                  <div className="relative p-5 sm:p-7 lg:p-8">
                    <div className="absolute right-5 top-5 text-b2 font-bold text-blue-100/50">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="pr-12 text-h7 font-bold leading-tight tracking-[-0.02em] text-white sm:text-h6">
                      {benefit.title}
                    </h3>
                    <p className="mt-4 text-b1 leading-relaxed text-blue-50/82">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
