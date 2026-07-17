"use client";

import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type DissolvePhase = "idle" | "covering" | "revealing";

const REVEAL_FADE_MS = 260;
const REDUCED_REVEAL_MS = 40;
const STUCK_OVERLAY_TIMEOUT_MS = 2000;

type PageDissolveTransitionProps = {
  children: ReactNode;
};

// Shared App Router dissolve: navigation starts immediately while a dark
// overlay covers the route swap, then dissolves once the new route commits.
export function PageDissolveTransition({ children }: PageDissolveTransitionProps) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<DissolvePhase>("idle");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const pathnameRef = useRef(pathname);
  const phaseRef = useRef<DissolvePhase>("idle");
  const revealTimerRef = useRef<number | null>(null);
  const stuckTimerRef = useRef<number | null>(null);
  const revealFrameRef = useRef<number | null>(null);
  const pendingRevealRef = useRef(false);
  const coverSessionRef = useRef(0);
  const beginCoverRef = useRef<() => void>(() => {});

  const clearTimers = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (stuckTimerRef.current !== null) {
      window.clearTimeout(stuckTimerRef.current);
      stuckTimerRef.current = null;
    }

    if (revealFrameRef.current !== null) {
      window.cancelAnimationFrame(revealFrameRef.current);
      revealFrameRef.current = null;
    }
  }, []);

  const setPhaseSafe = useCallback((next: DissolvePhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const performReveal = useCallback(() => {
    clearTimers();
    pendingRevealRef.current = false;
    setPhaseSafe("revealing");
    setOverlayVisible(false);

    const duration = prefersReducedMotion ? REDUCED_REVEAL_MS : REVEAL_FADE_MS;

    revealTimerRef.current = window.setTimeout(() => {
      setPhaseSafe("idle");
    }, duration);
  }, [clearTimers, prefersReducedMotion, setPhaseSafe]);

  const beginCover = useCallback(() => {
    clearTimers();
    pendingRevealRef.current = false;
    coverSessionRef.current += 1;
    setPhaseSafe("covering");
    setOverlayVisible(true);

    stuckTimerRef.current = window.setTimeout(() => {
      setOverlayVisible(false);
      setPhaseSafe("idle");
    }, STUCK_OVERLAY_TIMEOUT_MS);
  }, [clearTimers, setPhaseSafe]);

  useEffect(() => {
    beginCoverRef.current = beginCover;
  }, [beginCover]);

  const beginReveal = useCallback(() => {
    if (phaseRef.current === "idle") {
      return;
    }

    // Ensure the cover paints for at least one frame before dissolving,
    // so a same-tick route commit cannot skip the overlay entirely.
    if (phaseRef.current === "covering") {
      if (pendingRevealRef.current) {
        return;
      }

      pendingRevealRef.current = true;
      const session = coverSessionRef.current;

      revealFrameRef.current = window.requestAnimationFrame(() => {
        revealFrameRef.current = window.requestAnimationFrame(() => {
          if (session !== coverSessionRef.current) {
            return;
          }

          performReveal();
        });
      });
      return;
    }

    performReveal();
  }, [performReveal]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Cover on user navigation intent. Never preventDefault — routing starts immediately.
  // Do not patch history.pushState/replaceState: Next may call those inside
  // useInsertionEffect, where React forbids scheduling state updates.
  useEffect(() => {
    const isInternalNavigationHref = (href: string) => {
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return false;
      }

      let url: URL;

      try {
        url = new URL(href, window.location.href);
      } catch {
        return false;
      }

      if (url.origin !== window.location.origin) {
        return false;
      }

      const current = window.location;
      const sameDocument =
        url.pathname === current.pathname && url.search === current.search;

      // Hash-only jumps and identical locations are not route changes.
      if (sameDocument) {
        return false;
      }

      return true;
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || !isInternalNavigationHref(href)) {
        return;
      }

      beginCoverRef.current();
    };

    const handlePopState = () => {
      // Defer so we never setState during a browser/React commit turn.
      window.setTimeout(() => {
        beginCoverRef.current();
      }, 0);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      clearTimers();
    };
  }, [clearTimers]);

  // Once the App Router commits a new pathname, dissolve the cover away.
  // If navigation was programmatic (no prior click cover), flash a cover first.
  useEffect(() => {
    if (pathnameRef.current === pathname) {
      return;
    }

    pathnameRef.current = pathname;

    if (phaseRef.current === "idle") {
      beginCover();
    }

    beginReveal();
  }, [beginCover, beginReveal, pathname]);

  const revealMs = prefersReducedMotion ? REDUCED_REVEAL_MS : REVEAL_FADE_MS;
  const showOverlay = phase !== "idle";

  return (
    <>
      {children}
      {showOverlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 bg-background"
          style={{
            opacity: overlayVisible ? 1 : 0,
            // Cover appears instantly so the previous page never lingers;
            // only the reveal dissolves once the new route is ready.
            transition:
              phase === "revealing"
                ? `opacity ${revealMs}ms ease-out`
                : "none",
            ...(prefersReducedMotion || phase !== "covering"
              ? null
              : { filter: "blur(0.4px)" }),
          }}
        />
      ) : null}
    </>
  );
}
