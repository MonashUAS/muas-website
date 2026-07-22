"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type NextDestinationLinkProps = {
  description: string;
  href: string;
  id?: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
};

// NextDestinationLink previews a destination page; shared dissolve owns the route transition.
export function NextDestinationLink({
  description,
  href,
  id,
  imageAlt,
  imageSrc,
  title,
}: NextDestinationLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id={id}
      className="relative flex min-h-[calc(100vh-5rem)] scroll-mt-20 items-center justify-center bg-black-500 py-16 sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_45%,rgba(0,74,173,0.22),transparent_34%)]" />

      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <Link
          href={href}
          aria-label={title}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative block min-h-[30rem] overflow-hidden border border-white/10 bg-blue-950 shadow-[0_36px_120px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:min-h-[34rem] lg:min-h-[38rem]"
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="100vw"
            className={`object-cover object-center transition-all duration-700 ease-out motion-reduce:transition-none ${
              isHovered ? "scale-110 brightness-100" : "scale-100 brightness-75"
            }`}
          />

          <div className="pointer-events-none absolute inset-0 bg-black/30" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,8,25,0.97)_0%,rgba(0,8,25,0.86)_38%,rgba(0,8,25,0.42)_68%,rgba(0,8,25,0.12)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.08)_58%,rgba(0,8,25,0.72)_100%)]" />

          <div className="relative z-10 flex min-h-[30rem] items-center px-6 py-14 sm:min-h-[34rem] sm:px-10 lg:min-h-[38rem] lg:px-16">
            <div className="max-w-3xl">
              <h2 className="text-h6 font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-h4">
                {title}
              </h2>

              <p className="mt-6 max-w-2xl text-b1 leading-relaxed text-blue-50 sm:text-subtitle sm:leading-relaxed">
                {description}
              </p>

              <span className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-b1 font-bold text-blue-900 transition-colors duration-300 group-hover:bg-blue-100 motion-reduce:transition-none">
                Explore Now
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                >
                  <path
                    d="M5 12H19M13 6L19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-8 top-7 h-px bg-white/20 sm:inset-x-12" />
          <div className="pointer-events-none absolute bottom-8 right-8 h-14 w-36 border-b border-r border-white/20 sm:bottom-10 sm:right-12" />
        </Link>
      </div>
    </section>
  );
}
