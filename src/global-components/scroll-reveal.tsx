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
    let timelineListenersAttached = false;
    let observer: IntersectionObserver;

    const detachTimelineScrollListeners = () => {
      if (!timelineListenersAttached) {
        return;
      }

      timelineListenersAttached = false;

      if (timelineProgressFrame) {
        window.cancelAnimationFrame(timelineProgressFrame);
        timelineProgressFrame = 0;
      }

      window.removeEventListener("scroll", scheduleTimelineProgressUpdate);
      window.removeEventListener("resize", scheduleTimelineProgressUpdate);
      window.removeEventListener("pageshow", scheduleTimelineProgressUpdate);
      window.removeEventListener("popstate", scheduleTimelineProgressUpdate);
      document.removeEventListener(
        "visibilitychange",
        scheduleTimelineProgressUpdate,
      );
    };

    const maybeDetachTimelineScrollListeners = () => {
      if (nextTimelineIndex >= timelineTargets.length) {
        detachTimelineScrollListeners();
      }
    };

    const revealTimelineItem = (index: number) => {
      const target = timelineTargets[index];

      if (!target) {
        return;
      }

      queuedTimelineIndexes.delete(index);
      target.classList.add(VISIBLE_CLASS);
      observer.unobserve(target);
    };

    const revealQueuedTimelineItems = () => {
      if (
        isRevealingTimelineItem ||
        !queuedTimelineIndexes.has(nextTimelineIndex)
      ) {
        maybeDetachTimelineScrollListeners();
        return;
      }

      isRevealingTimelineItem = true;
      revealTimelineItem(nextTimelineIndex);
      nextTimelineIndex += 1;

      timelineRevealTimeout = window.setTimeout(() => {
        timelineRevealTimeout = null;
        isRevealingTimelineItem = false;
        revealQueuedTimelineItems();
      }, TIMELINE_REVEAL_STAGGER_MS);
    };

    const revealPassedTimelineItemsImmediately = (highestPassedIndex: number) => {
      if (timelineRevealTimeout !== null) {
        window.clearTimeout(timelineRevealTimeout);
        timelineRevealTimeout = null;
      }

      isRevealingTimelineItem = false;

      for (
        let index = nextTimelineIndex;
        index <= highestPassedIndex;
        index += 1
      ) {
        revealTimelineItem(index);
      }

      nextTimelineIndex = Math.max(nextTimelineIndex, highestPassedIndex + 1);
      revealQueuedTimelineItems();
      maybeDetachTimelineScrollListeners();
    };

    const enqueuePassedTimelineItems = () => {
      timelineProgressFrame = 0;

      if (
        timelineTargets.length === 0 ||
        nextTimelineIndex >= timelineTargets.length
      ) {
        detachTimelineScrollListeners();
        return;
      }

      const triggerLine = window.innerHeight * 0.88;
      let highestPassedIndex = -1;
      let shouldRevealImmediately = false;

      for (let index = nextTimelineIndex; index < timelineTargets.length; index += 1) {
        const target = timelineTargets[index];
        const rect = target.getBoundingClientRect();

        if (rect.top > triggerLine) {
          break;
        }

        highestPassedIndex = index;

        if (rect.bottom <= 0) {
          shouldRevealImmediately = true;
        }
      }

      if (highestPassedIndex < nextTimelineIndex) {
        return;
      }

      if (shouldRevealImmediately) {
        revealPassedTimelineItemsImmediately(highestPassedIndex);
        return;
      }

      for (let index = nextTimelineIndex; index <= highestPassedIndex; index += 1) {
        queuedTimelineIndexes.add(index);
      }

      revealQueuedTimelineItems();
      maybeDetachTimelineScrollListeners();
    };

    const scheduleTimelineProgressUpdate = () => {
      if (
        timelineProgressFrame ||
        timelineTargets.length === 0 ||
        nextTimelineIndex >= timelineTargets.length
      ) {
        return;
      }

      timelineProgressFrame = window.requestAnimationFrame(
        enqueuePassedTimelineItems,
      );
    };

    const attachTimelineScrollListeners = () => {
      if (timelineListenersAttached || timelineTargets.length === 0) {
        return;
      }

      timelineListenersAttached = true;
      window.addEventListener("scroll", scheduleTimelineProgressUpdate, {
        passive: true,
      });
      window.addEventListener("resize", scheduleTimelineProgressUpdate);
      window.addEventListener("pageshow", scheduleTimelineProgressUpdate);
      window.addEventListener("popstate", scheduleTimelineProgressUpdate);
      document.addEventListener(
        "visibilitychange",
        scheduleTimelineProgressUpdate,
      );
    };

    observer = new IntersectionObserver(
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
    attachTimelineScrollListeners();
    scheduleTimelineProgressUpdate();

    return () => {
      if (timelineProgressFrame) {
        window.cancelAnimationFrame(timelineProgressFrame);
      }

      if (timelineRevealTimeout !== null) {
        window.clearTimeout(timelineRevealTimeout);
      }

      detachTimelineScrollListeners();
      observer.disconnect();
    };
  }, [selector]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
