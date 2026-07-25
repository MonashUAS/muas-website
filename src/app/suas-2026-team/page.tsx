import Image from "next/image";
import { HomepageSponsorCarousel } from "@/app/home";
import { AnimatedTextHighlight } from "@/global-components/animated-text-highlight";
import { headerContentContainerClass } from "@/global-components/layout/sidebar/navbar-classes";
import { ScrollRevealProvider } from "@/global-components/scroll-reveal";
import { Projects } from "./projects/Projects";
import { RedbackWebHighlight } from "./redback-web-highlight";
import { TimelineRevealItem } from "./timeline-reveal";
import { TimelineWebField } from "./timeline-web-field";

const teamHeroImage = "/images/suas-team-page/hero/hero-redback.jpg";

const storyImage =
  "/images/suas-team-page/why-we-built-redback/why-we-built-redback.jpg";

const timelineWebImages = {
  spire: "/images/suas-team-page/production-timeline/timeline-web-spire.png",
  bridge: "/images/suas-team-page/production-timeline/timeline-web-bridge.png",
  shelf: "/images/suas-team-page/production-timeline/timeline-web-shelf.png",
  lattice: "/images/suas-team-page/production-timeline/timeline-web-lattice.png",
};

type TimelineItemContent = {
  date: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const timelineItems: TimelineItemContent[] = [
  {
    date: "4 July 2025",
    title: "First Design Meeting",
    body: "The SUAS Committee was inaugurated and began shaping the team's goals and approach for Redback against the 2025 ruleset.",
    image: "/images/homepage/quick-nav/our-drones.jpg",
    alt: "Redback aircraft on a field during flight testing",
  },
  {
    date: "25 September 2025",
    title: "Initial Propulsion System Specification Completed",
    body: "The initial propulsion system specification was completed. The system was designed to provide sufficient energy capacity without excessive weight while maintaining the power density required under competition flight conditions.",
    image: "/images/redback-projects/propulsion/propulsion-2.JPG",
    alt: "Redback propulsion hardware during team testing",
  },
  {
    date: "16 December 2025",
    title: "First Successful Lifeline Deployment",
    body: "The team successfully released the 155 g beacon payload from the minimum required altitude of 45 metres above ground level.",
    image: "/images/redback-projects/lifeline/lifeline-1.JPG",
    alt: "Team members working on the Redback lifeline payload system",
  },
  {
    date: "25 January 2026",
    title: "Gimbal Camera Hardware Integration",
    body: "The gimbal camera was integrated with a third-party network link and its connection stabilised. Packet loss was diagnosed using networking expertise and guidance from former team members.",
    image: "/images/homepage/hero/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems",
  },
  {
    date: "28 January 2026",
    title: "Redback Proof-of-Concept Maiden Flight",
    body: "Redback completed the successful maiden flight of its proof-of-concept aircraft, demonstrating stronger-than-expected flight performance during initial testing.",
    image: "/images/redback-projects/propulsion/propulsion-1.JPG",
    alt: "Redback aircraft flying low over a grass airfield",
  },
  {
    date: "09/02/2026",
    title: "CAD V2 Design Finished",
    body: "The airframe design was completed and released for manufacturing, giving the team a ready-to-build Redback V2 structure.",
    image: "/images/homepage/hero/flight-monitor.jpg",
    alt: "MUAS team member monitoring Redback systems during testing",
  },
  {
    date: "16/02/2026",
    title: "Redback V2 Frame Manufactured",
    body: "The Redback V2 airframe was manufactured and assembled in three days, turning the completed design into flight-ready structure.",
    image: "/images/homepage/hero/composites.jpg",
    alt: "Composite aircraft manufacturing work for Redback",
  },
  {
    date: "6 March 2026",
    title: "Redback V2 Maiden Flight",
    body: "Redback V2 completed its maiden flight with all competition avionics on board, a major VTOL integration milestone for the team.",
    image: "/images/homepage/quick-nav/our-drones.jpg",
    alt: "Redback aircraft during a flight testing day",
  },
  {
    date: "27/04/2026",
    title: "First Mission Management Mock Run",
    body: "The team completed beta testing of the full mission management system for a real-life flight, bringing the operational workflow into one coordinated run.",
    image: "/images/homepage/hero/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems during flight operations",
  },
  {
    date: "12 May 2026",
    title: "Vision Model Accuracy Improved",
    body: "YOLOv8 detection accuracy was initially limited because objects appeared very small at the minimum operating altitude. Performance was improved through image preprocessing and colour-based clustering to distinguish targets from the surrounding grass.",
    image: "/images/homepage/hero/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems",
  },
  {
    date: "29 May 2026",
    title: "Obstacle-Avoidance Simulation Testing and Verification",
    body: "The obstacle-avoidance system was tested through software-in-the-loop and hardware-in-the-loop simulations to verify its consistency and benchmark motion-planning response times.",
    image: "/images/drones/redback.png",
    alt: "Redback aircraft render",
  },
  {
    date: "12 June 2026",
    title: "Diversion and Mission-Return Simulation Testing",
    body: "The aircraft's diversion functionality and ability to return to its autonomous mission were tested and verified through software-in-the-loop and hardware-in-the-loop simulations.",
    image: "/images/drones/redback.png",
    alt: "Redback aircraft render",
  },
  {
    date: "In Progress",
    title: "Physical Avoidance and Diversion Test",
    body: "The avoidance and diversion functions will be physically tested at flight days, moving the autonomy stack from simulation into real aircraft behavior.",
    image: "/images/homepage/quick-nav/our-drones.jpg",
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
    image: "/images/homepage/hero/flight-monitor.jpg",
    alt: "Team member monitoring Redback systems",
  },
  {
    date: "17 July 2026",
    title: "First Successful Dual-Payload Delivery",
    body: "The team successfully validated the release of both competition payloads during a single mission flight.",
    image: "/images/redback-projects/lifeline/lifeline-2.JPG",
    alt: "Lifeline payload system components for Redback",
  },
  {
    date: "24 July 2026",
    title: "First Full Mock Competition Run",
    body: "A future full mock run will rehearse the competition mission end to end, giving every subteam a shared test of readiness under realistic operating conditions.",
    image: "/images/homepage/quick-nav/our-drones.jpg",
    alt: "Redback aircraft during flight testing",
  },
];

export default function SUAS2026TeamPage() {
  return (
    <ScrollRevealProvider className="bg-black-500 text-white">
      <div className="relative isolate overflow-hidden">
        <section
          id="suas-team-page"
          className="relative isolate flex min-h-[100svh] scroll-mt-20 items-center justify-center overflow-hidden bg-black px-6 pt-[var(--header-height)] text-white sm:px-10"
        >
          <Image
            src={teamHeroImage}
            alt="Redback aircraft flying low over a grass field"
            fill
            preload
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            className="object-cover object-[50%_42%]"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,7,20,0.3)_0%,rgba(0,7,20,0.18)_42%,rgba(0,7,20,0.68)_100%)]" />

          <div className="relative z-10 mx-auto flex w-full max-w-6xl -translate-y-20 flex-col items-center text-center sm:-translate-y-12">
            <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.065em] text-white">
              The Team Behind{" "}
              <RedbackWebHighlight>Redback</RedbackWebHighlight>
            </h1>

            <p className="mt-10 max-w-[52rem] text-[clamp(1.15rem,1.55vw,1.6rem)] font-medium leading-[1.55] tracking-[-0.015em] text-blue-50">
              Explore the rationale, development and key milestones behind Redback, from its initial design through manufacturing, 
              testing and flight.  
            </p>
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
                      <AnimatedTextHighlight variant="redback">
                        The Requirement
                      </AnimatedTextHighlight>
                      : Build one reliable aircraft that can search, 
                      map, avoid hazards and deliver a payload.
                    </li>
                    <li>
                      <AnimatedTextHighlight variant="redback">
                        The Approach
                      </AnimatedTextHighlight>
                      : Develop every subsystem around a shared airframe focused 
                      on performance, integration and serviceability.
                    </li>
                    <li>
                      <AnimatedTextHighlight variant="redback">
                        The Solution
                      </AnimatedTextHighlight>
                      : Use Redback as a common test platform so avionics, autonomy, 
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
                    alt="Studio image of Redback aircraft with cobwebs"
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
          className="relative isolate scroll-mt-20 overflow-hidden bg-[#001126] py-20 sm:py-28 lg:py-36"
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
          <div className="absolute inset-0 -z-30 bg-[linear-gradient(180deg,#000000_0%,#001126_42%,#000611_100%)]" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_16%,rgba(0,74,173,0.22),transparent_38%),radial-gradient(circle_at_66%_54%,rgba(84,134,200,0.12),transparent_30%)]" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.026)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:92px_92px] opacity-50" />
          <TimelineWebField images={timelineWebImages} />

          <div className={headerContentContainerClass}>
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
    </ScrollRevealProvider>
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
