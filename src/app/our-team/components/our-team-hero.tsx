"use client";

import Image from "next/image";

export function OurTeamHero() {
  return (
    <section
      id="our-team-page"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black px-6 pt-[var(--header-height)] text-white sm:px-10"
    >
      <Image
        src="/images/homepage/full-team-photo.jpg"
        alt="Monash UAS members standing together"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,7,20,0.3)_0%,rgba(0,7,20,0.18)_42%,rgba(0,7,20,0.68)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl -translate-y-2 flex-col items-center text-center sm:-translate-y-4">
        <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.065em] text-white">
          Meet the{" "}
          <span className="relative inline-block px-[0.2em]">
            Team

            <svg
              aria-hidden="true"
              viewBox="0 0 340 170"
              preserveAspectRatio="none"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[1.9em] w-[calc(100%+1em)] -translate-x-1/2 -translate-y-1/2 overflow-visible"
            >
              <path
                d="M22 98
                   C38 38, 126 14, 226 20
                   C292 24, 326 48, 320 84
                   C314 120, 258 146, 176 148
                   C92 150, 28 132, 18 104"
                pathLength="1"
                fill="none"
                stroke="#e4c56a"
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
                className="team-circle-primary"
              />

              <path
                d="M16 92
                   C30 50, 110 6, 214 10
                   C286 12, 334 42, 334 78
                   C334 122, 274 158, 176 160
                   C86 162, 18 136, 10 98"
                pathLength="1"
                fill="none"
                stroke="#e4c56a"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
                className="team-circle-secondary"
                opacity="0.95"
              />
            </svg>
          </span>
        </h1>

        <p className="mt-10 max-w-[52rem] text-[clamp(1.15rem,1.55vw,1.6rem)] font-medium leading-[1.55] tracking-[-0.015em] text-blue-50">
          More than 100 students across five specialised sections combine
          engineering, software, manufacturing, operations and flight testing
          to design, build and fly capable autonomous aircraft.
        </p>
      </div>

      <style jsx>{`
        .team-circle-primary,
        .team-circle-secondary {
          filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.18));
        }

        .team-circle-primary {
          animation: draw-pencil-circle 1s cubic-bezier(0.22, 1, 0.36, 1)
            0.15s forwards;
        }

        .team-circle-secondary {
          animation: draw-pencil-circle 1.05s cubic-bezier(0.22, 1, 0.36, 1)
            0.42s forwards;
        }

        @keyframes draw-pencil-circle {
          from {
            stroke-dashoffset: 1;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .team-circle-primary,
          .team-circle-secondary {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
}
