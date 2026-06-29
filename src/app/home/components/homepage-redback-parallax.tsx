"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  redbackFrames,
  SCROLL_SMOOTHING,
  SEQUENCE_COMPLETE_AT,
} from "../data/redback-frames";
import { clamp } from "../utils/clamp";
import { usePrefersReducedMotion } from "../utils/use-prefers-reduced-motion";

// Redback is MUAS' SUAS 2026 quadcopter. This homepage section is a teaser,
// linking to the detailed SUAS page instead of repeating the full reveal here.
export function HomepageRedbackParallax() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const targetProgressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let animationFrame = 0;

    const updateTargetProgress = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const scrollable = Math.max(1, section.offsetHeight - viewportHeight);
      // The outer section creates scroll distance; sticky travel maps to 0..1.
      const rawProgress = -rect.top / scrollable;

      targetProgressRef.current = clamp(rawProgress);
    };

    const updateSmoothedProgress = () => {
      setProgress((currentProgress) => {
        const nextProgress =
          currentProgress +
          (targetProgressRef.current - currentProgress) * SCROLL_SMOOTHING;

        if (Math.abs(nextProgress - targetProgressRef.current) < 0.001) {
          return targetProgressRef.current;
        }

        return nextProgress;
      });

      animationFrame = window.requestAnimationFrame(updateSmoothedProgress);
    };

    updateTargetProgress();
    animationFrame = window.requestAnimationFrame(updateSmoothedProgress);
    window.addEventListener("scroll", updateTargetProgress, { passive: true });
    window.addEventListener("resize", updateTargetProgress);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateTargetProgress);
      window.removeEventListener("resize", updateTargetProgress);
    };
  }, [prefersReducedMotion]);

  // Scroll progress is eased before mapping to frames. SEQUENCE_COMPLETE_AT
  // finishes the reveal before the sticky section releases, holding the final frame.
  const scrollProgress = prefersReducedMotion ? 1 : progress;
  const sequenceProgress = prefersReducedMotion
    ? 1
    : clamp(scrollProgress / SEQUENCE_COMPLETE_AT);
  const framePosition = prefersReducedMotion
    ? redbackFrames.length - 1
    : sequenceProgress * (redbackFrames.length - 1);
  const currentFrameIndex = Math.floor(framePosition);
  const nextFrameIndex = Math.min(redbackFrames.length - 1, currentFrameIndex + 1);
  const currentFrame = redbackFrames[currentFrameIndex];
  const nextFrame = redbackFrames[nextFrameIndex];
  const nextFrameOpacity =
    nextFrameIndex === currentFrameIndex ? 0 : framePosition - currentFrameIndex;
  const imageScale = 1 + sequenceProgress * 0.025;
  const glowOpacity = 0.18 + sequenceProgress * 0.28;
  const textOpacity = prefersReducedMotion
    ? 1
    : clamp((scrollProgress - 0.16) / 0.22);
  const textTranslateY = prefersReducedMotion ? 0 : (1 - textOpacity) * 24;

  // Preload first, final, and neighbouring frames to reduce flicker without
  // rendering every full-size frame. Dependencies stay fixed-size to avoid
  // React dependency-array errors.
  useEffect(() => {
    const preloadIndexes = new Set([
      0,
      redbackFrames.length - 1,
      Math.max(0, currentFrameIndex - 1),
      currentFrameIndex,
      nextFrameIndex,
      Math.min(redbackFrames.length - 1, currentFrameIndex + 2),
    ]);

    preloadIndexes.forEach((frameIndex) => {
      const image = new window.Image();
      image.src = redbackFrames[frameIndex];
    });
  }, [currentFrameIndex, nextFrameIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[220svh] overflow-visible bg-black-500 text-white"
      aria-labelledby="redback-homepage-heading"
    >
      {/* The sticky viewport is the parallax stage while the outer section supplies scroll range. */}
      <div className="sticky top-0 h-svh overflow-hidden bg-black">
        {/* Full-screen Redback frame sequence. The frame reveal is the primary effect. */}
        <div
          className="absolute inset-[-2%] z-0 will-change-transform"
          style={{
            transform: `scale(${imageScale})`,
          }}
        >
          <Image
            src={currentFrame}
            alt="Redback quadcopter reveal sequence"
            fill
            sizes="100vw"
            priority={currentFrameIndex === 0}
            className="object-cover object-center"
          />
          <Image
            src={nextFrame}
            alt=""
            fill
            sizes="100vw"
            aria-hidden="true"
            className="object-cover object-center"
            style={{ opacity: nextFrameOpacity }}
          />
        </div>

        {/* Blue glow layer that intensifies as the frame sequence brightens. */}
        <div
          className="absolute left-1/2 top-[68%] z-10 h-48 w-[78%] -translate-x-1/2 rounded-full bg-blue-300/35 blur-3xl sm:h-60 lg:h-72"
          style={{
            opacity: glowOpacity,
            transform: "translate3d(-50%, 0, 0)",
          }}
          aria-hidden="true"
        />

        {/* Readability overlays. These keep the image immersive while protecting the text. */}
        <div className="absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,31,73,0.56)_34%,rgba(0,0,0,0.12)_72%)]" />
        <div className="absolute inset-x-0 top-0 z-20 h-1/4 bg-[linear-gradient(180deg,rgba(0,0,0,0.72),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 z-20 h-1/3 bg-[linear-gradient(0deg,rgba(0,0,0,0.78),transparent)]" />

        <div
          className="relative z-30 mx-auto flex h-full max-w-[1720px] items-end px-6 pb-16 pt-24 sm:px-8 sm:pb-20 lg:items-center lg:px-12 lg:pb-0"
          style={{
            opacity: textOpacity,
            transform: `translate3d(0, ${textTranslateY}px, 0)`,
          }}
        >
          <div className="max-w-xl">
            <h2
              id="redback-homepage-heading"
              className="text-[clamp(3rem,7vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.05em] text-white"
            >
              Introducing Redback
            </h2>

            <p className="mt-7 max-w-lg text-b1 leading-7 text-blue-50/82 sm:text-subtitle">
              Built for SUAS 2026, Redback is MUAS&apos; newest custom
              quadcopter, designed for autonomous flight, aerial mapping, payload
              delivery, endurance, and transportability.
            </p>

            <Link
              href="/suas-2026-home"
              className="mt-9 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
