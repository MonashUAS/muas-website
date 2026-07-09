"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type TeamMember = {
  name: string;
  role: string;
};

type TeamSection = {
  label: string;
  href: string;
  summary: string;
  members: TeamMember[];
};

const placeholderImage = "/images/placeholder (to be replaced)/placeholder image.jpg";

const impactStats = [
  { value: 120, suffix: "+", label: "Members" },
  { value: 5, suffix: "", label: "Sections" },
  { value: 10, suffix: "+", label: "Years active" },
];

const teamSections: TeamSection[] = [
  {
    label: "Executive",
    href: "/our-team#executive",
    summary: "Team leadership, planning, sponsorship, and delivery.",
    members: [
      { name: "Ethan Liberman", role: "Team Lead" },
      { name: "Ethan Liberman", role: "Deputy Team Lead" },
      { name: "Ethan Liberman", role: "Operations Lead" },
    ],
  },
  {
    label: "Aerostructures",
    href: "/sections/aerostructures",
    summary: "Designing and building lightweight aircraft structures.",
    members: [
      { name: "Ethan Liberman", role: "Aerostructures Lead" },
      { name: "Ethan Liberman", role: "Composites Lead" },
      { name: "Ethan Liberman", role: "Manufacturing Lead" },
    ],
  },
  {
    label: "Avionics",
    href: "/sections/avionics",
    summary: "Developing onboard electronics, software, and payload systems.",
    members: [
      { name: "Ethan Liberman", role: "Avionics Lead" },
      { name: "Ethan Liberman", role: "Embedded Systems Lead" },
      { name: "Ethan Liberman", role: "Payload Lead" },
    ],
  },
  {
    label: "Operations",
    href: "/sections/operations",
    summary: "Coordinating people, logistics, events, and communications.",
    members: [
      { name: "Ethan Liberman", role: "Operations Lead" },
      { name: "Ethan Liberman", role: "Logistics Lead" },
      { name: "Ethan Liberman", role: "Sponsorship Lead" },
    ],
  },
  {
    label: "Propulsion",
    href: "/sections/propulsion",
    summary: "Testing and developing propulsion hardware for flight.",
    members: [
      { name: "Ethan Liberman", role: "Propulsion Lead" },
      { name: "Ethan Liberman", role: "Testing Lead" },
      { name: "Ethan Liberman", role: "Powertrain Lead" },
    ],
  },
  {
    label: "Flight Operations",
    href: "/sections/flight-ops",
    summary: "Planning, testing, and supporting safe aircraft flights.",
    members: [
      { name: "Ethan Liberman", role: "Flight Operations Lead" },
      { name: "Ethan Liberman", role: "Ground Control Lead" },
      { name: "Ethan Liberman", role: "Testing Coordinator" },
    ],
  },
  {
    label: "Lead Pilots",
    href: "/our-team#lead-pilots",
    summary: "Leading flight readiness, pilot training, and field operations.",
    members: [
      { name: "Ethan Liberman", role: "Lead Pilot" },
      { name: "Ethan Liberman", role: "Pilot" },
      { name: "Ethan Liberman", role: "Safety Officer" },
    ],
  },
];

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default function OurTeamPage() {
  const stickyTrackRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroShade, setHeroShade] = useState(0.44);

  const getScrollRange = useCallback(() => {
    const track = stickyTrackRef.current;

    if (!track) {
      return null;
    }

    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    const scrollStart = trackTop - 80;
    const progressStart = trackTop + window.innerHeight * 0.12;
    const end = trackTop + track.offsetHeight - window.innerHeight;

    return {
      scrollStart,
      progressStart,
      distance: Math.max(1, end - progressStart),
    };
  }, []);

  const scrollToTeamSection = useCallback(
    (index: number) => {
      const range = getScrollRange();

      if (!range) {
        return;
      }

      window.scrollTo({
        top:
          index === 0
            ? range.scrollStart
            : range.progressStart +
              (range.distance * index) / Math.max(1, teamSections.length - 1),
        behavior: "smooth",
      });
    },
    [getScrollRange],
  );

  useEffect(() => {
    const updatePageState = () => {
      const foldProgress = clamp(window.scrollY / (window.innerHeight * 0.75), 0, 1);
      const range = getScrollRange();

      setHeroShade(0.44 + foldProgress * 0.36);

      if (!range) {
        return;
      }

      const sectionProgress =
        (clamp(window.scrollY - range.progressStart, 0, range.distance) /
          range.distance) *
        (teamSections.length - 1);

      setActiveIndex(clamp(Math.round(sectionProgress), 0, teamSections.length - 1));
    };

    const scheduleUpdate = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        updatePageState();
      });
    };

    updatePageState();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [getScrollRange]);

  const activeSection = teamSections[activeIndex];

  return (
    <div className="relative bg-blue-900 text-white">
      <Hero onViewMembers={() => scrollToTeamSection(0)} shade={heroShade} />
      <section className="min-h-[calc(100vh-5rem)]" />

      <main className="relative z-10 overflow-x-clip bg-[linear-gradient(180deg,#000000_0%,#001f49_100%)] px-6">
        <Overview />
        <ManagementTeam
          activeIndex={activeIndex}
          activeSection={activeSection}
          scrollToTeamSection={scrollToTeamSection}
          stickyTrackRef={stickyTrackRef}
        />
        <JoinTeamCallout />
      </main>
    </div>
  );
}

function Hero({
  onViewMembers,
  shade,
}: {
  onViewMembers: () => void;
  shade: number;
}) {
  return (
    <section
      id="our-team-page"
      className="fixed inset-x-0 top-20 z-0 flex h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-blue-900 text-white"
    >
      <Image
        src="/images/homepage/full-team-photo.jpg"
        alt="MUAS team group portrait"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-black transition-colors duration-200"
        style={{ opacity: shade }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center uppercase">
        <h1 className="text-h4 font-black leading-none tracking-[-0.05em] sm:text-h2">
          Our Team
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-b2 font-black leading-relaxed text-blue-50 sm:text-b1">
          Meet the people designing, building, testing, and flying Monash UAS
          aircraft.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onViewMembers}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            View members
          </button>
          <Link
            href="/recruitment"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/28 bg-white/[0.06] px-6 text-b1 text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            Join the team
          </Link>
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col items-center justify-center py-16 text-center sm:py-20">
      <p className="max-w-3xl text-b2 leading-relaxed text-blue-50 sm:text-b1">
        Monash Uncrewed Aerial Systems brings together students across engineering,
        operations, software, manufacturing, and flight testing. Each section owns a
        focused part of the aircraft lifecycle while working toward the same mission:
        building capable autonomous aircraft and the people who can deliver them.
      </p>

      <div className="mt-12 grid w-full max-w-3xl grid-cols-3 gap-6 border-y border-white/12 py-8">
        {impactStats.map(({ label, suffix, value }) => {
          return (
            <div key={label} className="text-center">
              <AnimatedStat suffix={suffix} value={value} />
              <p className="mt-2 text-caption uppercase text-blue-100 sm:text-b2">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ManagementTeam({
  activeIndex,
  activeSection,
  scrollToTeamSection,
  stickyTrackRef,
}: {
  activeIndex: number;
  activeSection: TeamSection;
  scrollToTeamSection: (index: number) => void;
  stickyTrackRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      id="management-team"
      ref={stickyTrackRef}
      className="relative scroll-mt-20"
      style={{ height: `${teamSections.length * 96}vh` }}
    >
      <div className="sticky top-20 flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-center py-10 sm:py-12">
          <div className="text-center">
            <h2 className="text-h6 font-black uppercase leading-tight tracking-[-0.05em] sm:text-h5">
              2026 Management Team
            </h2>
            <p className="mt-3 text-b2 font-black uppercase text-blue-100 sm:text-b1">
              Explore by section
            </p>
          </div>

          <nav
            aria-label="Explore team sections"
            className="mx-auto mt-7 flex max-w-full justify-start gap-7 overflow-x-auto border-y border-white/12 py-4 text-b2 font-black text-blue-50 sm:mt-8 sm:justify-center sm:text-b1"
          >
            {teamSections.map((section, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  key={section.label}
                  type="button"
                  onClick={() => scrollToTeamSection(index)}
                  className={`relative shrink-0 pb-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                    isActive ? "text-white" : "text-blue-100 hover:text-white"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {section.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 bg-blue-300 transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="mx-auto mt-7 flex max-w-3xl flex-col items-center text-center sm:mt-8">
            <p className="text-b2 leading-relaxed text-blue-50 sm:text-b1">
              {activeSection.summary}
            </p>
            <Link
              href={activeSection.href}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-blue-500 px-6 text-b1 text-white transition-colors duration-300 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
            >
              See More
            </Link>
          </div>

          <div className="mt-8 grid gap-7 sm:mt-9 sm:grid-cols-3">
            {activeSection.members.slice(0, 3).map((member, index) => {
              return <MemberCard key={member.role} member={member} index={index} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  return (
    <article
      className={`mx-auto w-full max-w-[16rem] flex-col items-center text-center sm:flex sm:max-w-none ${
        index === 1 ? "flex" : "hidden"
      }`}
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-blue-900 ring-1 ring-white/15 sm:h-32 sm:w-32">
        <Image
          src={placeholderImage}
          alt={`${member.name}, ${member.role}`}
          fill
          sizes="8rem"
          className="object-cover"
        />
      </div>
      <h3 className="mt-5 text-b1 font-black text-white">{member.name}</h3>
      <p className="mt-2 text-b2 text-blue-100">{member.role}</p>
    </article>
  );
}

function JoinTeamCallout() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col items-center justify-center py-20 text-center">
      <h2 className="text-h6 font-black leading-tight tracking-[-0.05em] sm:text-h5">
        Want to be part of the team?
      </h2>
      <p className="mt-4 max-w-2xl text-b2 leading-relaxed text-blue-50 sm:text-b1">
        Join MUAS and help build the next generation of autonomous aircraft.
      </p>
      <Link
        href="/recruitment"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
      >
        Apply Now
      </Link>
    </section>
  );
}

function AnimatedStat({ suffix, value }: { suffix: string; value: number }) {
  const statRef = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = statRef.current;

    if (!element) {
      return;
    }

    let animationFrame = 0;
    let hasAnimated = false;

    const animate = () => {
      const start = performance.now();
      const duration = 1000;

      const tick = (time: number) => {
        const progress = clamp((time - start) / duration, 0, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const randomFlicker = progress < 0.72 ? Math.floor(Math.random() * 4) : 0;
        const nextValue = Math.min(
          value,
          Math.floor(value * easedProgress) + randomFlicker,
        );

        setDisplayValue(progress >= 1 ? value : nextValue);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
        }
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) {
          return;
        }

        hasAnimated = true;
        animate();
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <p className="text-h6 font-black leading-none text-white sm:text-h5">
      <span ref={statRef}>{displayValue}</span>
      {suffix}
    </p>
  );
}
