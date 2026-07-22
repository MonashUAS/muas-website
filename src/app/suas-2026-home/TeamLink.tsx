"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type CSSProperties, type MouseEvent, useRef, useState } from "react";

type TransitionRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

const teamHref = "/suas-2026-team";
const teamImage = "/images/homepage/full-team-photo.jpg";
const navbarHeight = "5rem";

// TeamLink previews the Redback team page with a zoom-through click transition.
export function TeamLink() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement | null>(null);
  
  // State for routing transition
  const [transitionRect, setTransitionRect] = useState<TransitionRect | null>(null);
  const [isTransitionFullScreen, setIsTransitionFullScreen] = useState(false);
  
  // State to track if the Explore button is currently hovered
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleTeamClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const preview = previewRef.current;

    if (!preview) {
      router.push(teamHref);
      return;
    }

    const rect = preview.getBoundingClientRect();

    setTransitionRect({
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    });
    
    window.requestAnimationFrame(() => {
      setIsTransitionFullScreen(true);
    });
    
    window.setTimeout(() => {
      router.push(teamHref);
    }, 760);
  };

  return (
    <section
      id="redback-team-link"
      className="relative flex min-h-[72svh] scroll-mt-20 items-center justify-center bg-black-500 pb-14 pt-8 sm:min-h-[76svh] sm:pb-16 sm:pt-10 lg:min-h-[82svh] lg:pb-20 lg:pt-12"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_45%,rgba(0,74,173,0.22),transparent_34%)]" />

      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div
          ref={previewRef}
          className="relative min-h-[30rem] overflow-hidden border border-white/10 bg-blue-950 shadow-[0_36px_120px_rgba(0,0,0,0.45)] sm:min-h-[34rem] lg:min-h-[38rem]"
        >
          <Image
            src={teamImage}
            alt="MUAS team group portrait"
            fill
            sizes="100vw"
            className={`object-cover object-center transition-all duration-700 ease-out ${
              isButtonHovered ? "scale-110 brightness-100" : "scale-100 brightness-75"
            }`}
          />

          {/* Background overlay gradients */}
          <div className="pointer-events-none absolute inset-0 bg-black/30" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,8,25,0.97)_0%,rgba(0,8,25,0.86)_38%,rgba(0,8,25,0.42)_68%,rgba(0,8,25,0.12)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.08)_58%,rgba(0,8,25,0.72)_100%)]" />

          {/* Text and Button Container */}
          <div className="pointer-events-none relative z-10 flex min-h-[30rem] items-center px-6 py-14 sm:min-h-[34rem] sm:px-10 lg:min-h-[38rem] lg:px-16">
            <div className="pointer-events-auto max-w-3xl">
              <h2 className="text-h6 font-black leading-[0.96] tracking-[-0.05em] text-white sm:text-h4">
                Next: The Redback Team
              </h2>

              <p className="mt-6 max-w-2xl text-b1 leading-relaxed text-blue-50 sm:text-subtitle sm:leading-relaxed">
                Learn about the people behind Redback and key design decisions made along
                the way towards SUAS 2026.
              </p>

              <Link
                href={teamHref}
                onClick={handleTeamClick}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className="group mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 py-3 text-b1 font-bold text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
              >
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
              </Link>
            </div>
          </div>

          {/* Decorative Borders */}
          <div className="pointer-events-none absolute inset-x-8 top-7 h-px bg-white/20 sm:inset-x-12" />
          <div className="pointer-events-none absolute bottom-8 right-8 h-14 w-36 border-b border-r border-white/20 sm:bottom-10 sm:right-12" />
        </div>
      </div>

      {transitionRect ? (
        <TransitionPreview
          isFullScreen={isTransitionFullScreen}
          transitionRect={transitionRect}
        />
      ) : null}
    </section>
  );
}

// TransitionPreview expands the clicked team photo into a fullscreen routing layer.
function TransitionPreview({
  isFullScreen,
  transitionRect,
}: {
  isFullScreen: boolean;
  transitionRect: TransitionRect;
}) {
  const transitionStyle: CSSProperties = isFullScreen
    ? {
        height: `calc(100vh - ${navbarHeight})`,
        left: 0,
        top: navbarHeight,
        width: "100vw",
      }
    : {
        height: transitionRect.height,
        left: transitionRect.left,
        top: transitionRect.top,
        width: transitionRect.width,
      };

  return (
    <div
      aria-hidden="true"
      className="fixed z-40 overflow-hidden bg-black-500 transition-all duration-700 ease-in-out"
      style={transitionStyle}
    >
      <Image
        alt=""
        className="h-full w-full object-cover"
        height={1080}
        src={teamImage}
        width={1920}
      />
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}
