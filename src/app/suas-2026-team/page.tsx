import Image from "next/image";
import Script from "next/script";
import { HomepageSponsorCarousel } from "@/app/home";
import { Projects } from "./projects/Projects";
import { TimelineRevealItem } from "./timeline-reveal";
import { TimelineWebField } from "./timeline-web-field";

const teamHeroImage = "/images/homepage/full-team-photo.jpg";

const storyImage = "/images/homepage/full-team-photo.jpg";

const timelineWebImages = {
  spire: "/images/suas-2026-team/timeline-web-spire.png",
  bridge: "/images/suas-2026-team/timeline-web-bridge.png",
  shelf: "/images/suas-2026-team/timeline-web-shelf.png",
  lattice: "/images/suas-2026-team/timeline-web-lattice.png",
};

const scrollRevealScript = `
(() => {
  const revealTargets = () => {
    document.documentElement.dataset.suasReveal = "ready";

    const targets = document.querySelectorAll("[data-suas-reveal]");
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12%",
        threshold: 0.16,
      },
    );

    targets.forEach((target) => observer.observe(target));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealTargets, { once: true });
  } else {
    revealTargets();
  }
})();
`;

type TimelineItemContent = {
  date: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const timelineItems: TimelineItemContent[] = [
  {
    date: "04/07/2025",
    title: "First Design Meeting",
    body: "The SUAS Committee was inaugurated and began shaping the team's goals and approach for Redback against the 2025 ruleset.",
    image: "/images/homepage/flight-day.jpg",
    alt: "Redback aircraft on a field during flight testing",
  },
  {
    date: "25/09/2025",
    title: "Propulsion System Spec Completed",
    body: "The initial propulsion specification was completed, balancing energy capacity, aircraft weight, and the power density needed to fly under competition conditions.",
    image: "/images/redback-projects/propulsion/propulsion-2.JPG",
    alt: "Redback propulsion hardware during team testing",
  },
  {
    date: "16/12/2025",
    title: "First Successful Lifeline Deployment",
    body: "The team successfully released the 155g beacon payload from the minimum altitude of 45m AGL, proving the Lifeline deployment system in flight.",
    image: "/images/redback-projects/lifeline/lifeline-1.JPG",
    alt: "Team members working on the Redback lifeline payload system",
  },
  {
    date: "28/01/2026",
    title: "Redback Maiden Flight",
    body: "Redback completed the maiden flight of the proof-of-concept aircraft and flew surprisingly well for a competition aircraft at that stage of development.",
    image: "/images/redback-projects/propulsion/propulsion-1.JPG",
    alt: "Redback aircraft flying low over a grass airfield",
  },
  {
    date: "09/02/2026",
    title: "CAD V2 Design Finished",
    body: "The airframe design was completed and released for manufacturing, giving the team a ready-to-build Redback V2 structure.",
    image: "/images/homepage/flight-monitor.jpg",
    alt: "MUAS team member monitoring Redback systems during testing",
  },
  {
    date: "16/02/2026",
    title: "Redback V2 Frame Manufactured",
    body: "The Redback V2 airframe was manufactured and assembled in three days, turning the completed design into flight-ready structure.",
    image: "/images/homepage/composites.jpg",
    alt: "Composite aircraft manufacturing work for Redback",
  },
  {
    date: "06/03/2026",
    title: "Redback V2 Maiden Flight",
    body: "Redback V2 completed its maiden flight with all competition avionics on board, a major VTOL integration milestone for the team.",
    image: "/images/homepage/flight-day.jpg",
    alt: "Redback aircraft during a flight testing day",
  },
  {
    date: "27/04/2026",
    title: "First Mission Management Mock Run",
    body: "The team completed beta testing of the full mission management system for a real-life flight, bringing the operational workflow into one coordinated run.",
    image: "/images/homepage/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems during flight operations",
  },
  {
    date: "In Progress",
    title: "First Successful Propulsion Test",
    body: "The upcoming propulsion test will validate the custom propeller setup and confirm that the aircraft can meet competition thrust and efficiency targets.",
    image: "/images/redback-projects/propulsion/propulsion-2.JPG",
    alt: "Redback propulsion components being prepared for testing",
  },
  {
    date: "In Progress",
    title: "Avoidance Simulation Verification",
    body: "SITL and HITL testing will validate that obstacle avoidance is functional, consistent, and fast enough for reliable competition motion planning.",
    image: "/images/drones/redback.png",
    alt: "Redback aircraft render",
  },
  {
    date: "In Progress",
    title: "Diversion Simulation Verification",
    body: "SITL and HITL testing will validate diversion and return-to-auto-mission behavior before the logic is taken to flight days.",
    image: "/images/drones/redback.png",
    alt: "Redback aircraft render",
  },
  {
    date: "In Progress",
    title: "Physical Avoidance and Diversion Test",
    body: "The avoidance and diversion functions will be physically tested at flight days, moving the autonomy stack from simulation into real aircraft behavior.",
    image: "/images/homepage/flight-day.jpg",
    alt: "Redback flight testing on an airfield",
  },
  {
    date: "In Progress",
    title: "First Braking System Drop Simulation",
    body: "The Lifeline team simulated payload release and brought the payload down to the desired drop speed, validating the braking concept before field deployment.",
    image: "/images/redback-projects/lifeline/lifeline-2.JPG",
    alt: "Lifeline payload system components for Redback",
  },
  {
    date: "Date TBC",
    title: "Propulsion Wiring Harness Repair",
    body: "The propulsion wiring harness on Redback had to be repaired under time pressure so the aircraft could be prepared for the upcoming flight day.",
    image: "/images/redback-projects/propulsion/propulsion-1.JPG",
    alt: "Redback propulsion and wiring hardware",
  },
  {
    date: "Future",
    title: "Vision Detection and Payload Deployment",
    body: "A future integrated milestone will combine vision detection and payload deployment in one flight, bringing perception and mission execution together.",
    image: "/images/homepage/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems",
  },
  {
    date: "Future",
    title: "First Full Mock Competition Run",
    body: "A future full mock run will rehearse the competition mission end to end, giving every subteam a shared test of readiness under realistic operating conditions.",
    image: "/images/homepage/flight-day.jpg",
    alt: "Redback aircraft during flight testing",
  },
];

export default function SUAS2026TeamPage() {
  return (
    <div className="bg-black-500 text-white">
      <div className="relative isolate overflow-hidden">
        <section
          id="suas-team-page"
          className="relative -mt-20 flex min-h-dvh scroll-mt-20 items-end overflow-hidden"
        >
          <Image
            src={teamHeroImage}
            alt="The MUAS Redback team standing with aircraft in a lecture theatre"
            fill
            preload
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="object-cover object-[50%_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.58)_76%,#000000_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_38%,transparent_0%,rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.72)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,#000000)]" />

          <div className="relative mx-auto flex min-h-dvh w-full max-w-[1720px] items-center justify-center px-5 pt-20 sm:px-8 lg:px-12">
            <div className="relative z-10 mx-auto flex w-full max-w-6xl -translate-y-2 flex-col items-center text-center sm:-translate-y-4">
              <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.065em] text-white">
                The Team Behind{" "}
                <span className="text-red-400">Redback</span>
              </h1>

              <p className="mt-10 max-w-[52rem] text-[clamp(1.15rem,1.55vw,1.6rem)] font-medium leading-[1.55] tracking-[-0.015em] text-blue-50">
                Students across engineering, software, manufacturing,
                operations and flight testing work together to design, build
                and fly Redback, Monash UAS&apos;s competition aircraft.
              </p>
            </div>
          </div>
        </section>

        <section
          id="the-redback-team"
          className="relative isolate scroll-mt-20 overflow-hidden bg-black-500 py-12 sm:py-16 lg:py-20"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_45%,rgba(0,74,173,0.15),transparent_34%)]" />

          <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
            <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(620px,1.28fr)] lg:items-center lg:gap-16">
              <div className="min-w-0 max-w-4xl">
                <h2 className="text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white">
                  Why We Built Redback
                </h2>

                <div className="mt-7 max-w-[42rem] space-y-5 text-b1 leading-relaxed text-blue-50/85 sm:text-subtitle sm:leading-relaxed">
                  <p>
                    Redback was developed to turn the 2026 SUAS mission into one
                    integrated aircraft program.
                  </p>

                  <ul className="list-disc space-y-5 pl-5 marker:text-blue-100/60">
                    <li>
                      The Requirement: Build one reliable aircraft that can search, 
                      map, avoid hazards and deliver a payload.
                    </li>
                    <li>
                      The Approach: Develop every subsystem around a shared airframe focused 
                      on performance, integration and serviceability.
                    </li>
                    <li>
                      The Solution: Use Redback as a common test platform so avionics, autonomy, 
                      payloads and flight operations mature together before competition.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative flex min-w-0 items-center justify-center lg:justify-end">
                <div className="relative h-[300px] w-full overflow-hidden border border-blue-100/20 bg-blue-900 shadow-[0_34px_110px_rgba(0,0,0,0.46)] [clip-path:polygon(5%_0,100%_0,100%_100%,0_100%)] sm:h-[420px] lg:h-[min(520px,calc(100svh-12rem))]">
                  <div className="absolute -inset-8 bg-blue-500/15 blur-3xl" />

                  <Image
                    src={storyImage}
                    alt="MUAS Redback team in navy shirts with aircraft"
                    fill
                    sizes="(min-width:1024px) 62vw, 100vw"
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

        <section
          id="the-production-timeline"
          className="relative isolate scroll-mt-20 overflow-hidden bg-[#001126] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
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
              }

              @media (prefers-reduced-motion: reduce) {
                [data-suas-reveal] {
                  opacity: 1;
                  transform: none;
                  transition: none;
                }
              }
            `}
          </style>
          <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#000000_0%,#001126_42%,#000611_100%)]" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_16%,rgba(0,74,173,0.22),transparent_38%),radial-gradient(circle_at_66%_54%,rgba(84,134,200,0.12),transparent_30%)]" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:92px_92px] opacity-50" />
          <TimelineWebField images={timelineWebImages} />

          <div className="mx-auto w-full max-w-[1720px]">
            <h2 className="max-w-[18ch] text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white">
              The Production Timeline
            </h2>

            <div className="relative mt-14 sm:mt-16 lg:mt-20">
              <div className="space-y-16 md:space-y-20 lg:space-y-24">
                {timelineItems.map((item, index) => (
                  <TimelineItem
                    key={`${item.date}-${item.title}`}
                    item={item}
                    align={index % 2 === 0 ? "left" : "right"}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Projects />

      <div id="suas-sponsors" className="scroll-mt-20">
        <HomepageSponsorCarousel
          heading="Thank You To Our Sponsors"
          headingId="suas-sponsors-heading"
        />
      </div>
      <Script
        id="suas-team-scroll-reveal"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: scrollRevealScript }}
      />
      <noscript>
        <style>
          {`
            [data-suas-reveal] {
              opacity: 1 !important;
              transform: none !important;
            }
          `}
        </style>
      </noscript>
    </div>
  );
}

type TimelineItemData = (typeof timelineItems)[number];

function TimelineItem({
  item,
  align,
  index,
}: {
  item: TimelineItemData;
  align: "left" | "right";
  index: number;
}) {
  const isLeft = align === "left";
  const textOrderClass = isLeft ? "md:order-1 md:text-right" : "md:order-2 md:text-left";
  const imageOrderClass = isLeft ? "md:order-2" : "md:order-1";

  return (
    <TimelineRevealItem
      index={index}
      className="relative isolate grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16"
    >
      <div className={`${textOrderClass} relative z-10 min-w-0`}>
        <div className={`max-w-2xl ${isLeft ? "md:ml-auto" : ""}`}>
          <p className="text-subtitle leading-tight text-blue-50/82">{item.date}</p>
          <h3 className="mt-2 text-h6 font-black leading-tight tracking-[-0.05em] text-white sm:text-h5">
            {item.title}
          </h3>
          <p className="mt-4 text-b1 leading-relaxed text-blue-50/84 sm:mt-5 sm:text-subtitle sm:leading-relaxed">
            {item.body}
          </p>
        </div>
      </div>

      <div className={`${imageOrderClass} relative z-10 min-w-0`}>
        <div className="relative h-[240px] w-full overflow-hidden border border-blue-100/20 bg-blue-900 shadow-[0_34px_110px_rgba(0,0,0,0.46)] sm:h-[360px] lg:h-[430px]">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 44vw, calc(100vw - 40px)"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.28)_0%,rgba(0,31,73,0.05)_48%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,31,73,0.3)_100%)]" />
          <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />
          <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
        </div>
      </div>
    </TimelineRevealItem>
  );
}
