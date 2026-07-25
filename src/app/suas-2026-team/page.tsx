import Image from "next/image";
import { HomepageSponsorCarousel } from "@/app/home";
import { AnimatedTextHighlight } from "@/global-components/animated-text-highlight";
import { headerContentContainerClass } from "@/global-components/layout/sidebar/navbar-classes";
import { ScrollRevealProvider } from "@/global-components/scroll-reveal";
import { Projects } from "./projects/Projects";
import { RedbackWebHighlight } from "./redback-web-highlight";
import { timelineItems } from "./timeline-data";
import { TimelineItem } from "./timeline-item";
import { TimelineWebField } from "./timeline-web-field";

const teamHeroImage = "/images/suas-team-page/hero/hero-redback.jpg";

const storyImage =
  "/images/suas-team-page/why-we-built-redback/Why We Built Redback.JPG";

const timelineWebImages = {
  spire: "/images/suas-team-page/production-timeline/timeline-web-spire.png",
  bridge: "/images/suas-team-page/production-timeline/timeline-web-bridge.png",
  shelf: "/images/suas-team-page/production-timeline/timeline-web-shelf.png",
  lattice: "/images/suas-team-page/production-timeline/timeline-web-lattice.png",
};

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
            <h2
              data-search-target-id="production-timeline-heading"
              data-search-highlight-mode="text"
              className="max-w-[18ch] text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white"
            >
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
