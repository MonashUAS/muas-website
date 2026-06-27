"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 420;
const FRAME_PATH = "/images/redback-animation/";

// Increase this value to make the scroll animation slower, or reduce it to make it faster.
const SCROLL_LENGTH_VH = 1200;

// Text timing is controlled as scroll progress from 0 to 1 across the hero section.
const TEXT_WINDOWS = {
  suas: { fadeInStart: 0.005, fadeInEnd: 0.01, fadeOutStart: 0.03, fadeOutEnd: 0.07 },
  presents: { fadeInStart: 0.08, fadeInEnd: 0.085, fadeOutStart: 0.105, fadeOutEnd: 0.13 },
  redback: { fadeInStart: 0.15, fadeInEnd: 0.2, fadeOutStart: 0.175, fadeOutEnd: 0.35 },
  rescue: { fadeInStart: 0.43, fadeInEnd: 0.5, fadeOutStart: 0.63, fadeOutEnd: 0.76 },
  closing: { fadeInStart: 0.84, fadeInEnd: 0.94 },
};

type TextWindow =
  | {
      fadeInStart: number;
      fadeInEnd: number;
      fadeOutStart: number;
      fadeOutEnd: number;
    }
  | {
      fadeInStart: number;
      fadeInEnd: number;
      fadeOutStart?: never;
      fadeOutEnd?: never;
    };

type OverlayCopy = {
  key: string;
  className: string;
  lines: string[];
  window: TextWindow;
  position: string;
};

const overlayCopy: OverlayCopy[] = [
  {
    key: "suas",
    className: "text-h5",
    lines: ["SUAS 2026."],
    window: TEXT_WINDOWS.suas,
    position: "justify-start text-left"
  },
  {
    key: "presents",
    className: "text-h5",
    lines: ["MUAS Presents"],
    window: TEXT_WINDOWS.presents,
    position: "justify-start text-left"
  },
  {
    key: "redback",
    className: "text-h3",
    lines: ["Redback."],
    window: TEXT_WINDOWS.redback,
    position: "justify-center text-center"
  },
  {
    key: "rescue",
    className: "max-w-2xl text-h5",
    lines: [
      "Built for search and rescue.",
      "Powered by innovation.",
      "Inspired by nature.",
    ],
    window: TEXT_WINDOWS.rescue,
    position: "justify-end text-right"
  },
  {
    key: "closing",
    className: "max-w-xl text-h5",
    lines: ["Rapid deployment of relief where it is  needed most."],
    window: TEXT_WINDOWS.closing,
    position: "justify-center text-center"
  },
];

// ScrollHero maps scroll progress to a frame sequence and timed copy overlays.
export function ScrollHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(1);
  const [progress, setProgress] = useState(0);

  // Tracks the section's scroll position and converts it into frame/progress state.
  useEffect(() => {
    let animationFrame = 0;

    const update = () => {
      const section = sectionRef.current;

      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = clamp(-rect.top / scrollable);
      const nextFrame = Math.round(nextProgress * (FRAME_COUNT - 1)) + 1;

      setProgress(nextProgress);
      setFrame(nextFrame);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Warms representative frames so the sequence responds quickly as scrolling begins.
  useEffect(() => {
    const warmFrames = [1, 2, 3, 4, 5, 6, 24, 48, 96, 144, 192, 240, 288, 336, 384, 420];

    warmFrames.forEach((warmFrame) => {
      const image = new Image();
      image.src = getFramePath(warmFrame);
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black-500" style={{ height: `${SCROLL_LENGTH_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black-500">
        <img
          alt="Redback aircraft animation"
          className="h-full w-full object-cover"
          draggable={false}
          src={getFramePath(frame)}
        />

        {overlayCopy.map((copy) => {
          const opacity = getTextOpacity(progress, copy.window);

          return (
            <div
              key={copy.key}
              aria-hidden={opacity < 0.05}
              className={`pointer-events-none absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16 ${copy.position}`}
              style={{
                opacity,
                transform: `translateY(${24 - opacity * 24}px)`,
                transition: "opacity 140ms linear, transform 140ms linear",
              }}
            >
              <h1 className={`${copy.className} font-medium leading-[1.05] text-white`}>
                {copy.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// getFramePath formats the current frame number into the matching public image URL.
function getFramePath(frame: number) {
  return `${FRAME_PATH}${String(frame).padStart(4, "0")}.png`;
}

// clamp keeps scroll and opacity values inside a predictable range.
function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

// fadeRange converts a progress range into a reusable 0-to-1 fade value.
function fadeRange(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start));
}

// getTextOpacity applies the per-copy fade timing, including final text with no fade-out.
function getTextOpacity(progress: number, window: TextWindow) {
  const fadeIn = fadeRange(progress, window.fadeInStart, window.fadeInEnd);

  if (window.fadeOutStart === undefined) {
    return fadeIn;
  }

  const fadeOut = 1 - fadeRange(progress, window.fadeOutStart, window.fadeOutEnd);
  return clamp(Math.min(fadeIn, fadeOut));
}
