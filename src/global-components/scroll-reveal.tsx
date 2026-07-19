"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProviderProps = {
  children: ReactNode;
  selector?: string;
  className?: string;
};

const DEFAULT_SELECTOR = "[data-suas-reveal]";
const VISIBLE_CLASS = "is-visible";

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
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

    return () => {
      observer.disconnect();
    };
  }, [selector]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
