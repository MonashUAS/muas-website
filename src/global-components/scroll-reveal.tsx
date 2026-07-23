"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProviderProps = {
  children: ReactNode;
  selector?: string;
  className?: string;
};

const DEFAULT_SELECTOR = "[data-suas-reveal]";
const VISIBLE_CLASS = "is-visible";
const TIMELINE_ITEM_SELECTOR = "[data-timeline-reveal-item]";
const TIMELINE_REVEAL_STAGGER_MS = 220;

// Remount-safe scroll reveal: observes targets inside this tree on each visit
// and disconnects when the route unmounts so client navigations reinitialise cleanly.
export function ScrollRevealProvider({
  children,
  selector = DEFAULT_SELECTOR,
  className,
}: ScrollRevealProviderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const targets = Array.from(
      container.querySelectorAll<HTMLElement>(selector),
    );

    if (!targets.length) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add(VISIBLE_CLASS));
      return;
    }

    const timelineTargets = targets.filter((target) =>
      target.matches(TIMELINE_ITEM_SELECTOR),
    );
    const timelineIndexes = new Map<Element, number>(
      timelineTargets.map((target, index) => [target, index]),
    );
    const queuedTimelineIndexes = new Set<number>();
    let nextTimelineIndex = 0;
    let isRevealingTimelineItem = false;
    let timelineProgressFrame = 0;
    let timelineRevealTimeout: number | null = null;

    const revealQueuedTimelineItems = () => {
      if (
        isRevealingTimelineItem ||
        !queuedTimelineIndexes.has(nextTimelineIndex)
      ) {
        return;
      }

      const target = timelineTargets[nextTimelineIndex];

      if (!target) {
        return;
      }

      isRevealingTimelineItem = true;
      queuedTimelineIndexes.delete(nextTimelineIndex);
      target.classList.add(VISIBLE_CLASS);
      observer.unobserve(target);
      nextTimelineIndex += 1;

      timelineRevealTimeout = window.setTimeout(() => {
        isRevealingTimelineItem = false;
        revealQueuedTimelineItems();
      }, TIMELINE_REVEAL_STAGGER_MS);
    };

    const enqueuePassedTimelineItems = () => {
      timelineProgressFrame = 0;

      if (timelineTargets.length === 0) {
        return;
      }

      const triggerLine = window.innerHeight * 0.88;
      const highestPassedIndex = timelineTargets.reduce(
        (highestIndex, target, index) => {
          if (target.getBoundingClientRect().top <= triggerLine) {
            return index;
          }

          return highestIndex;
        },
        -1,
      );

      if (highestPassedIndex < nextTimelineIndex) {
        return;
      }

      for (let index = nextTimelineIndex; index <= highestPassedIndex; index += 1) {
        queuedTimelineIndexes.add(index);
      }

      revealQueuedTimelineItems();
    };

    const scheduleTimelineProgressUpdate = () => {
      if (timelineProgressFrame || timelineTargets.length === 0) {
        return;
      }

      timelineProgressFrame = window.requestAnimationFrame(
        enqueuePassedTimelineItems,
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const timelineIndex = timelineIndexes.get(entry.target);

          if (timelineIndex !== undefined) {
            scheduleTimelineProgressUpdate();
            return;
          }

          entry.target.classList.add(VISIBLE_CLASS);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12%",
        threshold: 0.16,
      },
    );

    targets.forEach((target) => observer.observe(target));
    scheduleTimelineProgressUpdate();
    window.addEventListener("scroll", scheduleTimelineProgressUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleTimelineProgressUpdate);
    window.addEventListener("pageshow", scheduleTimelineProgressUpdate);

    return () => {
      if (timelineProgressFrame) {
        window.cancelAnimationFrame(timelineProgressFrame);
      }

      if (timelineRevealTimeout !== null) {
        window.clearTimeout(timelineRevealTimeout);
      }

      window.removeEventListener("scroll", scheduleTimelineProgressUpdate);
      window.removeEventListener("resize", scheduleTimelineProgressUpdate);
      window.removeEventListener("pageshow", scheduleTimelineProgressUpdate);
      observer.disconnect();
    };
  }, [selector]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
