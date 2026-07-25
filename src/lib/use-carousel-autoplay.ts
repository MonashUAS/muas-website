"use client";

import { useEffect, useState, type RefObject } from "react";

type UseCarouselAutoplayOptions = {
  enabled?: boolean;
  intervalMs: number;
  activeIndex: number;
  maxIndex: number;
  prefersReducedMotion: boolean;
  isInteractionPaused: boolean;
  /** When false, interval advance is skipped (e.g. active video slide). */
  canAdvance?: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onAdvance: () => void;
  rootMargin?: string;
};

/**
 * Shared carousel autoplay: loops, pauses on interaction / off-screen / hidden tab,
 * and restarts a full interval after manual navigation (activeIndex change).
 */
export function useCarouselAutoplay({
  enabled = true,
  intervalMs,
  activeIndex,
  maxIndex,
  prefersReducedMotion,
  isInteractionPaused,
  canAdvance = true,
  containerRef,
  onAdvance,
  rootMargin = "120px 0px",
}: UseCarouselAutoplayOptions) {
  const [isInView, setIsInView] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef, rootMargin]);

  useEffect(() => {
    const syncVisibility = () => {
      setIsDocumentVisible(document.visibilityState !== "hidden");
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);

    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (
      !enabled ||
      prefersReducedMotion ||
      isInteractionPaused ||
      !isInView ||
      !isDocumentVisible ||
      !canAdvance ||
      maxIndex === 0
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      onAdvance();
    }, intervalMs);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    activeIndex,
    canAdvance,
    enabled,
    intervalMs,
    isDocumentVisible,
    isInView,
    isInteractionPaused,
    maxIndex,
    onAdvance,
    prefersReducedMotion,
  ]);

  return { isInView, isDocumentVisible };
}
