"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __suasTimelineParallaxCleanup?: () => void;
  }
}

export function TimelineWebParallax() {
  const markerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!markerRef.current) return undefined;

    window.__suasTimelineParallaxCleanup?.();

    const section = document.getElementById("the-production-timeline");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!section || reduceMotion.matches) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = section.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const progress =
        travel > 0
          ? Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel))
          : 0;
      const centeredProgress = progress - 0.5;

      section.querySelectorAll<HTMLElement>("[data-timeline-web-motion]").forEach(
        (layer) => {
          const depth = Number(layer.dataset.webDepth || "0");
          const offset = Math.round(centeredProgress * depth * 1000) / 1000;
          layer.style.transform = `translate3d(0, ${offset}px, 0)`;
        },
      );
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const cleanup = () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };

    window.__suasTimelineParallaxCleanup = cleanup;
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    return cleanup;
  }, []);

  return (
    <span
      ref={markerRef}
      aria-hidden="true"
      data-timeline-web-parallax=""
      className="hidden"
    />
  );
}
