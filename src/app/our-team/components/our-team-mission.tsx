import Image from "next/image";
import { AnimatedTextHighlight } from "@/global-components/animated-text-highlight";

export function OurTeamMission() {
  return (
    <section
      id="our-mission"
      className="relative scroll-mt-20 overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_45%,rgba(0,74,173,0.15),transparent_34%)]" />

      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(620px,1.28fr)] lg:items-center lg:gap-16">
          <div className="min-w-0 max-w-4xl">
            <h2 className="text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white">
              Our Mission
            </h2>

            <div className="mt-7 max-w-[42rem] space-y-5 text-b1 leading-relaxed text-blue-50/85 sm:text-subtitle sm:leading-relaxed">
              <p>
                Monash UAS brings together{" "}
                <AnimatedTextHighlight variant="gold">
                  more than 100 members
                </AnimatedTextHighlight>{" "}
                across five specialised sections, each contributing to the
                design, production and operation of our aircraft.
              </p>

              <p>
                Our mission is to demonstrate the{" "}
                <AnimatedTextHighlight variant="gold">
                  humanitarian potential of uncrewed aerial systems
                </AnimatedTextHighlight>{" "}
                while giving students practical experience through competition,
                flight testing and real-world engineering.
              </p>

              <p>
                Through workshops and outreach, we also aim to{" "}
                <AnimatedTextHighlight variant="gold">
                  inspire the next generation of STEM students
                </AnimatedTextHighlight>
                .
              </p>
            </div>
          </div>

          <div className="relative flex min-w-0 items-center justify-center lg:justify-end">
            <div className="relative h-[300px] w-full overflow-hidden border border-blue-100/20 bg-blue-900 shadow-[0_34px_110px_rgba(0,0,0,0.46)] [clip-path:polygon(5%_0,100%_0,100%_100%,0_100%)] sm:h-[420px] lg:h-[min(520px,calc(100svh-12rem))]">
              <div className="absolute -inset-8 bg-blue-500/15 blur-3xl" />

              <Image
                src="/images/our team page/our mission/our mission.JPG"
                alt="Monash UAS members gathered around an aircraft display"
                fill
                sizes="(min-width:1024px) 62vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 47%" }}
              />

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.28)_0%,rgba(0,31,73,0.05)_48%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,31,73,0.3)_100%)]" />

              <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />

              <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
