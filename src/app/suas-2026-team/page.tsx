import Image from "next/image";
import Script from "next/script";
import type { CSSProperties } from "react";
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
  team: string;
  body: string;
  image: string;
  alt: string;
};

type TeamSponsor = {
  name: string;
  src: string;
  frameClassName: string;
};

type TeamSponsorRow = {
  desktopColumns: 1 | 2 | 3;
  sponsors: TeamSponsor[];
};

const redbackBuildNotes = [
  {
    label: "The Challenge",
    copy: "SUAS asks one aircraft to search, map, avoid hazards, deliver a payload, and keep flying through repeated field testing.",
  },
  {
    label: "The Approach",
    copy: "Redback brings those requirements into a shared airframe, so each subsystem is designed around flight performance, integration, and serviceability.",
  },
  {
    label: "The Outcome",
    copy: "The program gives MUAS a common testbed where CAD, avionics, autonomy, payloads, and flight operations mature together before competition.",
  },
];

const teamSponsorRows: TeamSponsorRow[] = [
  {
    desktopColumns: 2,
    sponsors: [
      {
        name: "Monash University",
        src: "/images/suas-2026-team/sponsors/monash-university-white.png",
        frameClassName: "h-32 w-full max-w-[26rem] sm:h-40 lg:h-44",
      },
      {
        name: "CubePilot",
        src: "/images/suas-2026-team/sponsors/cube-pilot-white.png",
        frameClassName: "h-40 w-full max-w-[24rem] sm:h-48 lg:h-52",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "Stahl Metall Engineering",
        src: "/images/suas-2026-team/sponsors/stahl-metall-white.png",
        frameClassName: "h-24 w-full max-w-[18rem]",
      },
      {
        name: "SUAS-ROV",
        src: "/images/suas-2026-team/sponsors/suas-rov-white.png",
        frameClassName: "h-32 w-full max-w-[10rem]",
      },
      {
        name: "Altium",
        src: "/images/suas-2026-team/sponsors/altium-white.png",
        frameClassName: "h-20 w-full max-w-[18rem]",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "Leap Australia",
        src: "/images/suas-2026-team/sponsors/leap-white.png",
        frameClassName: "h-28 w-full max-w-[13rem]",
      },
      {
        name: "Milliamp Diode",
        src: "/images/suas-2026-team/sponsors/milliamp-diode-white.png",
        frameClassName: "h-28 w-full max-w-[17rem]",
      },
      {
        name: "Ironbark Composites",
        src: "/images/suas-2026-team/sponsors/ironbark-composites-white.png",
        frameClassName: "h-24 w-full max-w-[20rem]",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "Ansys",
        src: "/images/suas-2026-team/sponsors/ansys-white.png",
        frameClassName: "h-24 w-full max-w-[18rem]",
      },
      {
        name: "Monash University PEARL",
        src: "/images/suas-2026-team/sponsors/pearl-logo---copy-white.png",
        frameClassName: "h-28 w-full max-w-[20rem]",
      },
      {
        name: "SAGE",
        src: "/images/suas-2026-team/sponsors/sage-white.png",
        frameClassName: "h-24 w-full max-w-[18rem]",
      },
    ],
  },
  {
    desktopColumns: 3,
    sponsors: [
      {
        name: "PTC",
        src: "/images/suas-2026-team/sponsors/ptc-2-white.png",
        frameClassName: "h-28 w-full max-w-[17rem]",
      },
      {
        name: "freedcamp",
        src: "/images/suas-2026-team/sponsors/freedcamp-white.png",
        frameClassName: "h-24 w-full max-w-[18rem]",
      },
      {
        name: "SIYI",
        src: "/images/suas-2026-team/sponsors/siyi-white.png",
        frameClassName: "h-28 w-full max-w-[17rem]",
      },
    ],
  },
  {
    desktopColumns: 1,
    sponsors: [
      {
        name: "Kiteaero",
        src: "/images/suas-2026-team/sponsors/copy-of-kiteaerologo-black-white.png",
        frameClassName: "h-14 w-full max-w-[18rem]",
      },
    ],
  },
];

const timelineItems: TimelineItemContent[] = [
  {
    date: "04/07/2025",
    title: "First Design Meeting",
    team: "SUAS Lead",
    body: "The SUAS Committee was inaugurated and began shaping the team's goals and approach for Redback against the 2025 ruleset.",
    image: "/images/homepage/flight-day.jpg",
    alt: "Redback aircraft on a field during flight testing",
  },
  {
    date: "25/09/2025",
    title: "Propulsion System Spec Completed",
    team: "Propulsion",
    body: "The initial propulsion specification was completed, balancing energy capacity, aircraft weight, and the power density needed to fly under competition conditions.",
    image: "/images/redback-projects/propulsion/propulsion-2.JPG",
    alt: "Redback propulsion hardware during team testing",
  },
  {
    date: "16/12/2025",
    title: "First Successful Lifeline Deployment",
    team: "Lifeline",
    body: "The team successfully released the 155g beacon payload from the minimum altitude of 45m AGL, proving the Lifeline deployment system in flight.",
    image: "/images/redback-projects/lifeline/lifeline-1.JPG",
    alt: "Team members working on the Redback lifeline payload system",
  },
  {
    date: "28/01/2026",
    title: "Redback Maiden Flight",
    team: "Flight Ops",
    body: "Redback completed the maiden flight of the proof-of-concept aircraft and flew surprisingly well for a competition aircraft at that stage of development.",
    image: "/images/redback-projects/propulsion/propulsion-1.JPG",
    alt: "Redback aircraft flying low over a grass airfield",
  },
  {
    date: "09/02/2026",
    title: "CAD V2 Design Finished",
    team: "Aerostructures",
    body: "The airframe design was completed and released for manufacturing, giving the team a ready-to-build Redback V2 structure.",
    image: "/images/homepage/flight-monitor.jpg",
    alt: "MUAS team member monitoring Redback systems during testing",
  },
  {
    date: "16/02/2026",
    title: "Redback V2 Frame Manufactured",
    team: "Aerostructures",
    body: "The Redback V2 airframe was manufactured and assembled in three days, turning the completed design into flight-ready structure.",
    image: "/images/homepage/composites.jpg",
    alt: "Composite aircraft manufacturing work for Redback",
  },
  {
    date: "06/03/2026",
    title: "Redback V2 Maiden Flight",
    team: "Flight Ops",
    body: "Redback V2 completed its maiden flight with all competition avionics on board, a major VTOL integration milestone for the team.",
    image: "/images/homepage/flight-day.jpg",
    alt: "Redback aircraft during a flight testing day",
  },
  {
    date: "27/04/2026",
    title: "First Mission Management Mock Run",
    team: "Mission Management",
    body: "The team completed beta testing of the full mission management system for a real-life flight, bringing the operational workflow into one coordinated run.",
    image: "/images/homepage/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems during flight operations",
  },
  {
    date: "In Progress",
    title: "First Successful Propulsion Test",
    team: "Propulsion",
    body: "The upcoming propulsion test will validate the custom propeller setup and confirm that the aircraft can meet competition thrust and efficiency targets.",
    image: "/images/redback-projects/propulsion/propulsion-2.JPG",
    alt: "Redback propulsion components being prepared for testing",
  },
  {
    date: "In Progress",
    title: "Avoidance Simulation Verification",
    team: "DNA",
    body: "SITL and HITL testing will validate that obstacle avoidance is functional, consistent, and fast enough for reliable competition motion planning.",
    image: "/images/drones/redback.png",
    alt: "Redback aircraft render",
  },
  {
    date: "In Progress",
    title: "Diversion Simulation Verification",
    team: "DNA",
    body: "SITL and HITL testing will validate diversion and return-to-auto-mission behavior before the logic is taken to flight days.",
    image: "/images/drones/redback.png",
    alt: "Redback aircraft render",
  },
  {
    date: "In Progress",
    title: "Physical Avoidance and Diversion Test",
    team: "DNA",
    body: "The avoidance and diversion functions will be physically tested at flight days, moving the autonomy stack from simulation into real aircraft behavior.",
    image: "/images/homepage/flight-day.jpg",
    alt: "Redback flight testing on an airfield",
  },
  {
    date: "In Progress",
    title: "First Braking System Drop Simulation",
    team: "Lifeline",
    body: "The Lifeline team simulated payload release and brought the payload down to the desired drop speed, validating the braking concept before field deployment.",
    image: "/images/redback-projects/lifeline/lifeline-2.JPG",
    alt: "Lifeline payload system components for Redback",
  },
  {
    date: "Date TBC",
    title: "Propulsion Wiring Harness Repair",
    team: "Stack",
    body: "The propulsion wiring harness on Redback had to be repaired under time pressure so the aircraft could be prepared for the upcoming flight day.",
    image: "/images/redback-projects/propulsion/propulsion-1.JPG",
    alt: "Redback propulsion and wiring hardware",
  },
  {
    date: "Future",
    title: "Vision Detection and Payload Deployment",
    team: "SUAS Lead",
    body: "A future integrated milestone will combine vision detection and payload deployment in one flight, bringing perception and mission execution together.",
    image: "/images/homepage/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems",
  },
  {
    date: "Future",
    title: "First Full Mock Competition Run",
    team: "SUAS Lead",
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
            <h1 className="max-w-[11ch] text-center text-[clamp(4rem,13vw,13.5rem)] font-bold uppercase leading-[0.86] text-white drop-shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
              The{" "}
              <span className="text-white">
                Redback
              </span>{" "}
              Team
            </h1>
          </div>
        </section>

        <section
          id="the-redback-team"
          className="relative isolate scroll-mt-20 overflow-hidden bg-black-500 px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16 lg:px-12 lg:pb-36"
        >
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_34%,rgba(0,74,173,0.24),transparent_30%),radial-gradient(circle_at_86%_62%,rgba(90,12,12,0.24),transparent_30%),linear-gradient(180deg,#000000_0%,#020712_48%,#000000_100%)]" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.032)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:96px_96px] opacity-40" />
          <div className="absolute inset-x-0 top-0 -z-10 h-28 bg-[linear-gradient(180deg,#000000,transparent)]" />

          <div className="mx-auto w-full max-w-[1720px]">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:items-start lg:gap-16">
              <div className="lg:sticky lg:top-28">
                <h2 className="max-w-[12ch] text-[clamp(3rem,6.6vw,7rem)] font-bold uppercase leading-[0.9] text-white">
                  Why We Built Redback
                </h2>
                <p className="mt-7 max-w-xl border-t border-white/14 pt-6 text-subtitle leading-relaxed text-blue-50/82 sm:text-h7 sm:leading-snug">
                  Redback was developed to turn the 2026 SUAS mission into a
                  single aircraft program, rather than a collection of separate
                  technical projects.
                </p>

                <div className="mt-9 divide-y divide-white/12 border-y border-white/12">
                  {redbackBuildNotes.map((note) => (
                    <div key={note.label} className="py-5">
                      <p className="text-b2 uppercase text-red-400/82">
                        {note.label}
                      </p>
                      <p className="mt-2 text-b1 leading-relaxed text-blue-50/78 sm:text-subtitle sm:leading-relaxed">
                        {note.copy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="relative min-h-[430px] overflow-hidden border-t border-red-800 bg-blue-900 shadow-[0_32px_120px_rgba(0,0,0,0.54)] sm:min-h-[600px] lg:min-h-[760px]">
                <Image
                  src={storyImage}
                  alt="MUAS Redback team in navy shirts with aircraft"
                  fill
                  sizes="(min-width: 1024px) 62vw, calc(100vw - 40px)"
                  className="object-cover object-[50%_48%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.08)_56%,rgba(0,0,0,0.38)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-1 bg-red-800" />
                <div className="absolute bottom-5 left-5 max-w-sm border-l border-white/38 pl-4 text-b2 uppercase leading-5 text-white/64 sm:bottom-7 sm:left-7">
                    Full team build, one aircraft program
                </div>
              </div>

                <div className="mt-5 grid gap-4 border-t border-white/12 pt-5 text-b2 uppercase text-blue-100/58 sm:grid-cols-3">
                  <p>Design</p>
                  <p>Manufacture</p>
                  <p>Flight Test</p>
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
            <h2 className="max-w-[13ch] text-[clamp(2.9rem,6vw,6.8rem)] font-bold uppercase leading-[0.92] text-white">
              The Production Timeline
            </h2>

            <div className="relative mt-16 lg:mt-24">
              <div className="space-y-20 md:space-y-8 lg:space-y-0">
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

      <section
        id="suas-sponsors"
        className="scroll-mt-20 bg-black-500 px-5 pb-20 pt-12 text-white sm:px-8 sm:pb-28 sm:pt-16 lg:px-12"
      >
        <div className="mx-auto w-full max-w-5xl text-center">
          <p className="text-b2 uppercase text-blue-100">Thank You To Our</p>
          <h2 className="mt-1 text-h6 font-bold uppercase leading-tight sm:text-h5">
            Sponsors
          </h2>
          <p className="mt-3 text-b2 text-blue-50/78 sm:text-b1">
            For making the Redback journey possible.
          </p>

          <div className="mt-8 px-5 py-7 sm:px-8 sm:py-10">
            <TeamSponsorGrid />
          </div>
        </div>
      </section>
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

function TeamSponsorGrid() {
  return (
    <div>
      {teamSponsorRows.map((row, rowIndex) => {
        const rowSpacingClass =
          rowIndex === 0
            ? ""
            : rowIndex === teamSponsorRows.length - 1
              ? "mt-1 sm:mt-3 lg:mt-4"
              : "mt-3 sm:mt-6 lg:mt-10";

        return (
          <div
            key={row.sponsors.map((sponsor) => sponsor.name).join("-")}
            className={`grid grid-cols-12 gap-y-2 sm:gap-x-8 sm:gap-y-4 ${rowSpacingClass}`}
          >
            {row.sponsors.map((sponsor, sponsorIndex) => {
              const isTabletOrphan =
                row.desktopColumns === 3 && sponsorIndex === 2;
              const isTabletCentered =
                row.desktopColumns === 1 || isTabletOrphan;

              const desktopColumnClass =
                row.desktopColumns === 1
                  ? "lg:col-span-12"
                  : row.desktopColumns === 2
                    ? "lg:col-span-6"
                    : "lg:col-span-4";

              return (
                <div
                  key={sponsor.name}
                  data-suas-reveal=""
                  style={{
                    "--suas-reveal-delay": `${Math.min(rowIndex, 4) * 70}ms`,
                  } as CSSProperties}
                  className={`col-span-12 flex items-center justify-center sm:col-span-6 ${
                    row.desktopColumns === 2
                      ? "h-36 sm:h-44 lg:h-56"
                      : "h-28 sm:h-36 lg:h-44"
                  } ${desktopColumnClass} ${
                    isTabletCentered
                      ? "sm:col-start-4 lg:col-start-auto"
                      : ""
                  }`}
                >
                  <div
                    className={`relative max-h-full drop-shadow-[0_0_24px_rgba(255,255,255,0.16)] ${sponsor.frameClassName}`}
                  >
                    <Image
                      src={sponsor.src}
                      alt={`${sponsor.name} logo`}
                      fill
                      sizes={
                        row.desktopColumns === 1
                          ? "(min-width: 1024px) 18rem, (min-width: 640px) 18rem, calc(100vw - 116px)"
                          : row.desktopColumns === 2
                            ? "(min-width: 1024px) 26rem, (min-width: 640px) calc(50vw - 74px), calc(100vw - 116px)"
                            : "(min-width: 1024px) 20rem, (min-width: 640px) calc(50vw - 74px), calc(100vw - 116px)"
                      }
                      className="object-contain"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
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
  const textOrderClass = isLeft ? "md:order-1 md:text-right" : "md:order-2";
  const imageOrderClass = isLeft ? "md:order-2" : "md:order-1";
  const verticalOffset = index === 0 ? "" : isLeft ? "lg:-mt-6" : "lg:mt-10";

  return (
    <TimelineRevealItem
      index={index}
      className={`relative isolate grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16 ${verticalOffset}`}
    >
      <div className={`${textOrderClass} relative z-10 min-w-0`}>
        <div className="inline-block max-w-2xl">
          <p className="text-subtitle leading-tight text-blue-50/82">{item.date}</p>
          <h3 className="mt-1 text-h7 font-bold leading-tight text-red-400 sm:text-h6">
            {item.title}
          </h3>
          <p className="mt-3 text-b2 uppercase text-blue-100/58">
            {item.team}
          </p>
          <p className="mt-5 text-b1 leading-relaxed text-blue-50/84 sm:text-subtitle sm:leading-relaxed">
            {item.body}
          </p>
        </div>
      </div>

      <div className={`${imageOrderClass} relative z-10 min-w-0`}>
        <div className="relative h-[240px] overflow-hidden border-[5px] border-red-800 bg-blue-900 shadow-[0_28px_96px_rgba(0,0,0,0.55)] sm:h-[360px] lg:h-[430px]">
          <div className="absolute -top-[5px] left-0 z-10 h-3 w-1/2 bg-red-700" />
          <div className="absolute -top-[5px] left-1/2 z-10 h-3 w-28 bg-white" />
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 44vw, calc(100vw - 40px)"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,31,73,0.18))]" />
          <p className="absolute left-4 top-5 text-b2 uppercase text-white/46">
            Team member working on Redback
          </p>
        </div>
      </div>
    </TimelineRevealItem>
  );
}
