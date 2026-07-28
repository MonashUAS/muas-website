"use client";

import type { ReactNode } from "react";

type RedbackWebHighlightProps = {
  children: ReactNode;
};

// Hub-centred orb web behind Redback: white strands draw first, then the label sticks.
export function RedbackWebHighlight({
  children,
}: RedbackWebHighlightProps) {
  return (
    <span className="relative inline-block px-[0.6em] pb-[0.06em]">
      <span className="redback-web-label relative z-10 inline-block bg-gradient-to-r from-red-500 via-red-300 to-red-100 bg-clip-text pr-[0.1em] text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
        {children}
      </span>

      <svg
        aria-hidden="true"
        viewBox="0 0 360 220"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[2.2em] w-[calc(100%+1.65em)] -translate-x-1/2 -translate-y-1/2 overflow-visible"
      >
        {/* Radial spokes from a shared hub */}
        <path
          d="M180 112 L68 38"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-1"
        />

        <path
          d="M180 112 L118 24"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-2"
          opacity="0.92"
        />

        <path
          d="M180 112 L180 16"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.95"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-3"
        />

        <path
          d="M180 112 L248 26"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-4"
          opacity="0.9"
        />

        <path
          d="M180 112 L312 52"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-5"
        />

        <path
          d="M180 112 L338 112"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-6"
          opacity="0.88"
        />

        <path
          d="M180 112 L304 168"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-7"
          opacity="0.86"
        />

        <path
          d="M180 112 L214 202"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-8"
          opacity="0.82"
        />

        <path
          d="M180 112 L128 196"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-9"
          opacity="0.84"
        />

        <path
          d="M180 112 L52 148"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.85"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-spoke redback-web-spoke-10"
          opacity="0.88"
        />

        {/* Inner polygonal ring — straight facets between spokes */}
        <path
          d="M146 72 L164 58 L196 56 L226 70 L242 98 L230 128 L198 142 L158 136 L140 108 Z"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-ring redback-web-ring-1"
          opacity="0.9"
        />

        {/* Mid ring — incomplete for an asymmetric hand-drawn feel */}
        <path
          d="M118 52 L152 34 L198 30 L248 46 L288 82 L298 122 L274 158 L228 178 L168 176 L118 152 L98 114 L104 74"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-ring redback-web-ring-2"
          opacity="0.78"
        />

        {/* Outer ring segments — incomplete orb edge */}
        <path
          d="M88 44 L132 20 L190 14 L250 28 L304 62 L330 108"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-ring redback-web-ring-3"
          opacity="0.7"
        />

        <path
          d="M324 132 L292 176 L236 198 L168 194 L108 166 L72 128"
          pathLength="1"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="redback-web-ring redback-web-ring-4"
          opacity="0.64"
        />
      </svg>

      <style jsx>{`
        .redback-web-spoke,
        .redback-web-ring {
          filter: drop-shadow(0 0 0.6px rgba(255, 255, 255, 0.28));
        }

        .redback-web-spoke-1 {
          animation: draw-redback-web 0.72s
            cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards;
        }

        .redback-web-spoke-2 {
          animation: draw-redback-web 0.7s
            cubic-bezier(0.22, 1, 0.36, 1) 0.12s forwards;
        }

        .redback-web-spoke-3 {
          animation: draw-redback-web 0.72s
            cubic-bezier(0.22, 1, 0.36, 1) 0.16s forwards;
        }

        .redback-web-spoke-4 {
          animation: draw-redback-web 0.7s
            cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
        }

        .redback-web-spoke-5 {
          animation: draw-redback-web 0.72s
            cubic-bezier(0.22, 1, 0.36, 1) 0.24s forwards;
        }

        .redback-web-spoke-6 {
          animation: draw-redback-web 0.68s
            cubic-bezier(0.22, 1, 0.36, 1) 0.28s forwards;
        }

        .redback-web-spoke-7 {
          animation: draw-redback-web 0.7s
            cubic-bezier(0.22, 1, 0.36, 1) 0.32s forwards;
        }

        .redback-web-spoke-8 {
          animation: draw-redback-web 0.68s
            cubic-bezier(0.22, 1, 0.36, 1) 0.36s forwards;
        }

        .redback-web-spoke-9 {
          animation: draw-redback-web 0.7s
            cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }

        .redback-web-spoke-10 {
          animation: draw-redback-web 0.7s
            cubic-bezier(0.22, 1, 0.36, 1) 0.44s forwards;
        }

        .redback-web-ring-1 {
          animation: draw-redback-web 0.85s
            cubic-bezier(0.22, 1, 0.36, 1) 0.48s forwards;
        }

        .redback-web-ring-2 {
          animation: draw-redback-web 0.9s
            cubic-bezier(0.22, 1, 0.36, 1) 0.56s forwards;
        }

        .redback-web-ring-3 {
          animation: draw-redback-web 0.82s
            cubic-bezier(0.22, 1, 0.36, 1) 0.64s forwards;
        }

        .redback-web-ring-4 {
          animation: draw-redback-web 0.82s
            cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards;
        }

        .redback-web-label {
          opacity: 0;
          transform: translateY(-0.18em) scale(0.88);
          transform-origin: center bottom;
          animation: stick-redback-label 0.65s
            cubic-bezier(0.22, 1.35, 0.36, 1) 0.95s forwards;
        }

        @keyframes draw-redback-web {
          from {
            stroke-dashoffset: 1;
          }

          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes stick-redback-label {
          0% {
            opacity: 0;
            transform: translateY(-0.18em) scale(0.88);
          }

          62% {
            opacity: 1;
            transform: translateY(0.02em) scale(1.045);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .redback-web-spoke,
          .redback-web-ring {
            animation: none;
            stroke-dashoffset: 0;
          }

          .redback-web-label {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </span>
  );
}
