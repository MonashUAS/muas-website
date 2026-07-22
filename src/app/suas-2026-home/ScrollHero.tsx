"use client";

import { useEffect, useRef, useState } from "react";
import {
  scrollHeroCopy,
  type ScrollHeroLine,
  type TextWindow,
} from "./scroll-hero-data";
import { searchSlug } from "@/lib/search/content";
import LoadingScreen from "./LoadingScreen"

const FRAME_COUNT = 420;
const FRAME_PATH = "/images/redback-animation/";
const PRELOAD_CONCURRENCY = 12;

// Increase this value to make the scroll animation slower, or reduce it to make it faster.
const SCROLL_LENGTH_VH = 1200;

// Adjust this percentage to fine-tune the animation pan between frames 160 and 342.
// 0% is the absolute left edge, 50% is dead center. 
const ANIMATION_PAN_OFFSET = "35%";

function getLineText(line: ScrollHeroLine) {
  return typeof line === "string"
    ? line
    : line.segments.map((segment) => segment.text).join("");
}

// ScrollHero maps scroll progress to a frame sequence and timed copy overlays.
export function ScrollHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [frame, setFrame] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedFrameCount, setLoadedFrameCount] = useState(0);
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

  // Preloads the full sequence so scroll position can map directly to cached frames.
  useEffect(() => {
    let isCancelled = false;

    preloadFrames((loadedCount) => {
      if (isCancelled) {
        return;
      }

      setLoadedFrameCount(loadedCount);

      if (loadedCount === FRAME_COUNT) {
        setIsLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section ref={sectionRef} id="suas-hero" className="relative scroll-mt-20 bg-black-500" style={{ height: `${SCROLL_LENGTH_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black-500">
        {scrollHeroCopy
          .filter((copy) => copy.layer === "behind-frame")
          .map((copy) => {
            const opacity = getTextOpacity(progress, copy.window);

            return <ScrollHeroText copy={copy} key={copy.key} opacity={opacity} />;
          })}

        <img
          alt="Redback aircraft animation"
          className="relative z-10 h-full w-full object-cover transition-[object-position] duration-500 ease-in-out"
          draggable={false}
          src={getFramePath(frame)}
          style={{
            objectPosition: frame >= 160 && frame <= 342 ? `${ANIMATION_PAN_OFFSET} center` : "center"
          }}
        />

        {scrollHeroCopy
          .filter((copy) => copy.layer !== "behind-frame")
          .map((copy) => {
            const opacity = getTextOpacity(progress, copy.window);

            return <ScrollHeroText copy={copy} key={copy.key} opacity={opacity} />;
          })}

        {!isLoaded && (
          <LoadingScreen
            progress={(loadedFrameCount / FRAME_COUNT) * 100}
          />
        )}  
      </div>
    </section>
  );
}

// ScrollHeroText renders one timed copy overlay in either the foreground or background layer.
function ScrollHeroText({
  copy,
  opacity,
}: {
  copy: (typeof scrollHeroCopy)[number];
  opacity: number;
}) {
  const zIndexClass = copy.layer === "behind-frame" ? "z-0" : "z-20";
  const textColorClass = copy.className.includes("text-transparent")
    ? ""
    : "text-white";
  const gradientGuardClass = copy.className.includes("text-transparent")
    ? "inline-block overflow-visible pr-[0.08em] pb-[0.06em]"
    : "";

  return (
    <div
      aria-hidden={opacity < 0.05}
      className={`pointer-events-none absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16 ${zIndexClass} ${copy.position}`}
      style={{
        opacity,
        transform: `translateY(${24 - opacity * 24}px)`,
        transition: "opacity 80ms linear, transform 80ms linear",
      }}
    >
      <h1
        className={`${copy.className} ${gradientGuardClass} font-medium leading-tight tracking-tighter ${textColorClass}`}
      >
        {copy.lines.map((line, index) => (
          <span
            key={index}
            className="block"
            data-search-target-id={`suas-hero-${copy.key}-${searchSlug(getLineText(line))}`}
            data-search-highlight-mode="text"
          >
            <ScrollHeroLineText line={line} />
          </span>
        ))}
      </h1>
    </div>
  );
}

// ScrollHeroLineText renders either a plain line or a line with styled word spans.
function ScrollHeroLineText({ line }: { line: ScrollHeroLine }) {
  if (typeof line === "string") {
    return line;
  }

  return line.segments.map((segment, index) => (
    <span
      className={`${segment.className ?? ""} ${
        segment.className?.includes("text-transparent")
          ? "inline-block overflow-visible pr-[0.08em] pb-[0.04em]"
          : ""
      }`}
      key={`${segment.text}-${index}`}
    >
      {segment.text}
    </span>
  ));
}

// preloadFrames fills the browser cache with the complete frame sequence at a controlled pace.
function preloadFrames(onProgress: (loadedCount: number) => void) {
  let loadedCount = 0;
  let nextFrame = 1;

  const loadNext = () => {
    if (nextFrame > FRAME_COUNT) {
      return;
    }

    const frameToLoad = nextFrame;
    nextFrame += 1;
    const image = new Image();

    const completeFrame = () => {
      loadedCount += 1;
      onProgress(loadedCount);
      loadNext();
    };

    image.onload = completeFrame;
    image.onerror = completeFrame;
    image.src = getFramePath(frameToLoad);
  };

  for (let worker = 0; worker < PRELOAD_CONCURRENCY; worker += 1) {
    loadNext();
  }
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
