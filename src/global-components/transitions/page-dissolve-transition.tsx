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
const QUERY_NAVIGATION_REVEAL_MS = 140;
const STUCK_OVERLAY_TIMEOUT_MS = 2000;

type PageDissolveTransitionProps = {
  children: ReactNode;
};

function getLocationKey(url: URL) {
  return `${url.pathname}${url.search}`;
}

// Shared App Router dissolve: navigation starts immediately while a dark
// overlay covers the route swap, then dissolves once the new route commits.
export function PageDissolveTransition({
  children,
}: PageDissolveTransitionProps) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<DissolvePhase>("idle");
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const pathnameRef = useRef(pathname);
  const phaseRef = useRef<DissolvePhase>("idle");
  const transitionIdRef = useRef(0);
  const lastLocationKeyRef = useRef("");
  const revealTimerRef = useRef<number | null>(null);
  const stuckTimerRef = useRef<number | null>(null);
  const queryNavigationTimerRef = useRef<number | null>(null);
  const popstateTimerRef = useRef<number | null>(null);
  const revealFrameRef = useRef<[number | null, number | null]>([null, null]);
  const startNavigationTransitionRef = useRef<
    (expectsPathnameChange: boolean) => void
  >(() => {});

  const clearAsyncWork = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (stuckTimerRef.current !== null) {
      window.clearTimeout(stuckTimerRef.current);
      stuckTimerRef.current = null;
    }

    if (queryNavigationTimerRef.current !== null) {
      window.clearTimeout(queryNavigationTimerRef.current);
      queryNavigationTimerRef.current = null;
    }

    if (popstateTimerRef.current !== null) {
      window.clearTimeout(popstateTimerRef.current);
      popstateTimerRef.current = null;
    }

    for (const frame of revealFrameRef.current) {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    }

    revealFrameRef.current = [null, null];
  }, []);

  const setPhaseSafe = useCallback((next: DissolvePhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const completeTransition = useCallback(
    (transitionId: number) => {
      if (transitionIdRef.current !== transitionId) {
        return;
      }

      clearAsyncWork();
      setOverlayVisible(false);
      setPhaseSafe("idle");
    },
    [clearAsyncWork, setPhaseSafe],
  );

  const beginReveal = useCallback(
    (transitionId: number) => {
      if (
        transitionIdRef.current !== transitionId ||
        phaseRef.current === "idle"
      ) {
        return;
      }

      if (revealFrameRef.current[0] !== null) {
        return;
      }

      if (stuckTimerRef.current !== null) {
        window.clearTimeout(stuckTimerRef.current);
        stuckTimerRef.current = null;
      }

      if (queryNavigationTimerRef.current !== null) {
        window.clearTimeout(queryNavigationTimerRef.current);
        queryNavigationTimerRef.current = null;
      }

      if (popstateTimerRef.current !== null) {
        window.clearTimeout(popstateTimerRef.current);
        popstateTimerRef.current = null;
      }

      const revealMs = prefersReducedMotion ? REDUCED_REVEAL_MS : REVEAL_FADE_MS;

      revealFrameRef.current[0] = window.requestAnimationFrame(() => {
        revealFrameRef.current[0] = null;

        revealFrameRef.current[1] = window.requestAnimationFrame(() => {
          revealFrameRef.current[1] = null;

          if (transitionIdRef.current !== transitionId) {
            return;
          }

          setPhaseSafe("revealing");
          setOverlayVisible(false);

          revealTimerRef.current = window.setTimeout(() => {
            completeTransition(transitionId);
          }, revealMs);
        });
      });
    },
    [completeTransition, prefersReducedMotion, setPhaseSafe],
  );

  const startNavigationTransition = useCallback(
    (expectsPathnameChange: boolean) => {
      clearAsyncWork();
      transitionIdRef.current += 1;
      const transitionId = transitionIdRef.current;

      setPhaseSafe("covering");
      setOverlayVisible(true);

      if (expectsPathnameChange) {
        stuckTimerRef.current = window.setTimeout(() => {
          beginReveal(transitionId);
        }, STUCK_OVERLAY_TIMEOUT_MS);
        return;
      }

      queryNavigationTimerRef.current = window.setTimeout(() => {
        beginReveal(transitionId);
      }, QUERY_NAVIGATION_REVEAL_MS);
    },
    [beginReveal, clearAsyncWork, setPhaseSafe],
  );

  useEffect(() => {
    startNavigationTransitionRef.current = startNavigationTransition;
  }, [startNavigationTransition]);

  useEffect(() => {
    lastLocationKeyRef.current = `${window.location.pathname}${window.location.search}`;
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Cover on user navigation intent. Never preventDefault: routing starts immediately.
  // Do not patch history.pushState/replaceState: Next may call those inside
  // useInsertionEffect, where React forbids scheduling state updates.
  useEffect(() => {
    const getInternalNavigationTarget = (href: string) => {
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return null;
      }

      let url: URL;

      try {
        url = new URL(href, window.location.href);
      } catch {
        return null;
      }

      if (url.origin !== window.location.origin) {
        return null;
      }

      const currentUrl = new URL(window.location.href);

      // Hash-only jumps and identical path/search locations are not route changes.
      if (getLocationKey(url) === getLocationKey(currentUrl)) {
        return null;
      }

      return {
        expectsPathnameChange: url.pathname !== currentUrl.pathname,
        key: getLocationKey(url),
      };
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
      const navigationTarget = href ? getInternalNavigationTarget(href) : null;

      if (!navigationTarget) {
        return;
      }

      lastLocationKeyRef.current = navigationTarget.key;
      startNavigationTransitionRef.current(
        navigationTarget.expectsPathnameChange,
      );
    };

    const handlePopState = () => {
      if (popstateTimerRef.current !== null) {
        window.clearTimeout(popstateTimerRef.current);
      }

      // Defer so we never setState during a browser/React commit turn.
      popstateTimerRef.current = window.setTimeout(() => {
        popstateTimerRef.current = null;

        const currentUrl = new URL(window.location.href);
        const nextKey = getLocationKey(currentUrl);

        if (lastLocationKeyRef.current === nextKey) {
          return;
        }

        const previousPathname = pathnameRef.current;
        lastLocationKeyRef.current = nextKey;
        startNavigationTransitionRef.current(
          currentUrl.pathname !== previousPathname,
        );
      }, 0);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      clearAsyncWork();
    };
  }, [clearAsyncWork]);

  // Once the App Router commits a new pathname, dissolve the cover away.
  // If navigation was programmatic (no prior click cover), flash a cover first.
  // Defer state updates so they never run in the same turn as the router commit
  // (avoids "state update on a component that hasn't mounted yet" during transitions).
  useEffect(() => {
    if (pathnameRef.current === pathname) {
      return;
    }

    pathnameRef.current = pathname;

    if (typeof window !== "undefined") {
      lastLocationKeyRef.current = `${window.location.pathname}${window.location.search}`;
    }

    const timeoutId = window.setTimeout(() => {
      if (phaseRef.current === "idle") {
        startNavigationTransition(true);
      }

      beginReveal(transitionIdRef.current);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [beginReveal, pathname, startNavigationTransition]);

  const revealMs = prefersReducedMotion ? REDUCED_REVEAL_MS : REVEAL_FADE_MS;
  const showOverlay = phase !== "idle";

  return (
    <>
      {children}
      {showOverlay ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[70] bg-background"
          style={{
            opacity: overlayVisible ? 1 : 0,
            // Cover appears instantly so the previous page never lingers;
            // only the reveal dissolves once the new route is ready.
            transition:
              phase === "revealing"
                ? `opacity ${revealMs}ms ease-out`
                : "none",
          }}
        />
      ) : null}
    </>
  );
}
