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

// TeamLink previews the Redback team page with the same zoom-through click transition as section pages.
export function TeamLink() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [transitionRect, setTransitionRect] = useState<TransitionRect | null>(null);
  const [isTransitionFullScreen, setIsTransitionFullScreen] = useState(false);

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
      className="relative flex min-h-[calc(100vh-5rem)] scroll-mt-20 items-center bg-black-500 px-6 py-20 text-white"
    >
      <Link
        aria-label="Learn about the Redback team"
        className="group mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        href={teamHref}
        onClick={handleTeamClick}
      >
        <h2 className="text-center text-[clamp(1.5rem,3vw,3rem)] font-medium leading-none tracking-tighter text-white pb-3">
          Next:{" "}
          <span className="underline underline-offset-8 transition-colors group-hover:text-red-400">
            The Redback Team
          </span>
        </h2>
        <p className="mt-4 space-y-1 text-h7 leading-tight text-white/68">
          Learn about the people behind Redback and key design decisions made along
          the way towards SUAS 2026.
        </p>

        <div
          ref={previewRef}
          className="mt-10 aspect-[16/9] w-full max-w-3xl overflow-hidden bg-black-50"
        >
          <Image
            alt="MUAS team group portrait"
            className="h-full w-full object-cover brightness-75 transition duration-700 ease-out group-hover:scale-110 group-hover:brightness-100"
            height={720}
            src={teamImage}
            width={1280}
          />
        </div>
      </Link>

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
