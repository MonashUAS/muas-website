"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    href: "/suas-2026-team",
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
    href: "/sections/flight-ops",
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
  return (
    <div className="relative bg-blue-900 text-white">
      <Hero />
      <section className="min-h-[calc(100vh-5rem)]" />

      <main className="relative z-10 overflow-x-clip bg-[linear-gradient(180deg,#000000_0%,#001f49_100%)] px-6">
        <Overview />
        <ManagementTeam />
        <JoinTeamCallout />
      </main>
    </div>
  );
}

function Hero() {
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
      <div className="absolute inset-0 bg-black/52" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
        <h1 className="text-h4 font-black leading-none tracking-[-0.05em] sm:text-h2">
          Our Team
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-b2 font-medium leading-relaxed text-blue-50 sm:text-b1">
          Meet the people designing, building, testing, and flying Monash UAS
          aircraft.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="#management-team"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            View members
          </Link>
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
    <section className="mx-auto grid w-full max-w-5xl gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.82fr)] lg:items-center">
      <div>
        <p className="text-b1 leading-relaxed text-blue-50 sm:text-subtitle">
          Monash Uncrewed Aerial Systems brings together students across engineering,
          operations, software, manufacturing, and flight testing. Each section owns a
          focused part of the aircraft lifecycle while working toward the same mission:
          building capable autonomous aircraft and the people who can deliver them.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {impactStats.map(({ label, suffix, value }) => {
          return (
            <div
              key={label}
              className="rounded-[1.25rem] border border-white/12 bg-white/[0.07] px-5 py-5 text-center backdrop-blur-md sm:text-left"
            >
              <AnimatedStat suffix={suffix} value={value} />
              <p className="mt-2 text-caption uppercase text-blue-100">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ManagementTeam() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSection = teamSections[activeIndex];

  return (
    <section
      id="management-team"
      className="mx-auto w-full max-w-5xl scroll-mt-20 py-16 sm:py-20"
    >
      <div className="text-center">
        <h2 className="text-h6 font-black uppercase leading-tight tracking-[-0.05em] sm:text-h5">
          2026 Management Team
        </h2>
        <p className="mt-3 text-b2 font-medium text-blue-100 sm:text-b1">
          Explore by section
        </p>
      </div>

      <nav
        aria-label="Explore team sections"
        className="mx-auto mt-8 flex max-w-full justify-start gap-3 overflow-x-auto pb-2 text-b2 font-medium text-blue-50 sm:justify-center sm:text-b1"
      >
        {teamSections.map((section, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={section.label}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 rounded-full border px-4 py-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none ${
                isActive
                  ? "border-white bg-white text-blue-900"
                  : "border-white/20 bg-white/[0.05] text-blue-100 backdrop-blur-md hover:bg-white/[0.1] hover:text-white"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              {section.label}
            </button>
          );
        })}
      </nav>

      <p className="mx-auto mt-8 max-w-3xl text-center text-b2 leading-relaxed text-blue-50 sm:text-b1">
        {activeSection.summary}
      </p>

      <div className="mt-9 grid gap-7 sm:grid-cols-3">
        {activeSection.members.slice(0, 3).map((member) => {
          return <MemberCard key={member.role} member={member} />;
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href={activeSection.href}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-500 px-6 text-b1 text-white transition-colors duration-300 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="mx-auto flex w-full max-w-[16rem] flex-col items-center text-center sm:max-w-none">
      <div className="relative h-28 w-28 overflow-hidden rounded-full bg-blue-900 ring-1 ring-white/15 sm:h-36 sm:w-36">
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
    <section className="mx-auto grid w-full max-w-5xl gap-8 py-16 sm:py-20 lg:grid-cols-[0.95fr_minmax(0,1fr)] lg:items-center">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-blue-900 ring-1 ring-white/12">
        <Image
          src="/images/homepage/flight-day.jpg"
          alt="MUAS members preparing aircraft on a flight day"
          fill
          sizes="(min-width: 1024px) 30rem, 100vw"
          className="object-cover"
        />
      </div>

      <div className="text-center lg:text-left">
        <h2 className="text-h6 font-black leading-tight tracking-[-0.05em] sm:text-h5">
          Want to be part of the team?
        </h2>
        <p className="mt-4 text-b2 leading-relaxed text-blue-50 sm:text-b1">
          Join MUAS and help build the next generation of autonomous aircraft.
        </p>
        <Link
          href="/recruitment"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
        >
          Apply Now
        </Link>
      </div>
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
