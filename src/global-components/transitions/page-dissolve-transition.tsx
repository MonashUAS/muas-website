"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  dispatchSearchRouteReady,
  SEARCH_TRANSITION_NAVIGATION_EVENT,
  type SearchTransitionNavigationDetail,
} from "@/lib/search/navigation-events";

type DissolvePhase = "idle" | "pendingEnter" | "entering";

const ENTER_MS = 280;

type PageDissolveTransitionProps = {
  children: ReactNode;
};

function getLocationKey(url: URL) {
  return `${url.pathname}${url.search}`;
}

function resetScrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function userPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Shared App Router dissolve: hide instantly, navigate now, scroll to top, then fade in.
export function PageDissolveTransition({
  children,
}: PageDissolveTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [phase, setPhase] = useState<DissolvePhase>("pendingEnter");
  const [opacity, setOpacity] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const pathnameRef = useRef(pathname);
  const transitionIdRef = useRef(0);
  const enterTimerRef = useRef<number | null>(null);
  const enterFrameRef = useRef<[number | null, number | null]>([null, null]);
  const hasMountedRef = useRef(false);

  const clearAsyncWork = useCallback(() => {
    if (enterTimerRef.current !== null) {
      window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }

    for (const frame of enterFrameRef.current) {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    }

    enterFrameRef.current = [null, null];
  }, []);

  const beginEnter = useCallback(
    (transitionId: number) => {
      if (transitionIdRef.current !== transitionId) {
        return;
      }

      resetScrollToTop();
      setOpacity(0);
      setPhase("pendingEnter");

      if (prefersReducedMotion || userPrefersReducedMotion()) {
        setOpacity(1);
        setPhase("idle");
        return;
      }

      enterFrameRef.current[0] = window.requestAnimationFrame(() => {
        enterFrameRef.current[0] = null;

        enterFrameRef.current[1] = window.requestAnimationFrame(() => {
          enterFrameRef.current[1] = null;

          if (transitionIdRef.current !== transitionId) {
            return;
          }

          resetScrollToTop();
          setPhase("entering");
          setOpacity(1);

          enterTimerRef.current = window.setTimeout(() => {
            if (transitionIdRef.current !== transitionId) {
              return;
            }

            setPhase("idle");
            enterTimerRef.current = null;
          }, ENTER_MS);
        });
      });
    },
    [prefersReducedMotion],
  );

  const startNavigation = useCallback(
    (href: string) => {
      clearAsyncWork();
      transitionIdRef.current += 1;

      // Instant hide — no dissolve-out of the current page.
      setPhase("pendingEnter");
      setOpacity(0);
      resetScrollToTop();
      router.push(href);
    },
    [clearAsyncWork, router],
  );

  useEffect(() => {
    history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

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

      if (getLocationKey(url) === getLocationKey(currentUrl)) {
        return null;
      }

      return `${url.pathname}${url.search}${url.hash}`;
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

      event.preventDefault();
      startNavigation(navigationTarget);
    };

    const handlePopState = () => {
      clearAsyncWork();
      transitionIdRef.current += 1;
      const transitionId = transitionIdRef.current;
      beginEnter(transitionId);
    };

    const handleTransitionNavigation = (event: Event) => {
      const navigationEvent =
        event as CustomEvent<SearchTransitionNavigationDetail>;
      const href = navigationEvent.detail?.href;

      if (!href) {
        return;
      }

      startNavigation(href);
    };

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener(
      SEARCH_TRANSITION_NAVIGATION_EVENT,
      handleTransitionNavigation,
    );

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener(
        SEARCH_TRANSITION_NAVIGATION_EVENT,
        handleTransitionNavigation,
      );
      clearAsyncWork();
    };
  }, [clearAsyncWork, startNavigation]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      pathnameRef.current = pathname;
      const transitionId = transitionIdRef.current;
      const frame = window.requestAnimationFrame(() => {
        beginEnter(transitionId);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (pathnameRef.current === pathname) {
      return;
    }

    pathnameRef.current = pathname;
    const transitionId = transitionIdRef.current;

    clearAsyncWork();
    beginEnter(transitionId);
  }, [beginEnter, clearAsyncWork, pathname]);

  useEffect(() => {
    if (phase !== "idle") {
      return;
    }

    dispatchSearchRouteReady(pathname);
  }, [pathname, phase]);

  return (
    <div
      className="page-dissolve-shell flex min-h-0 w-full flex-1 flex-col"
      style={{
        opacity,
        transition:
          phase === "entering" && !prefersReducedMotion
            ? `opacity ${ENTER_MS}ms ease-out`
            : "none",
        pointerEvents: phase === "pendingEnter" ? "none" : undefined,
      }}
    >
      {children}
    </div>
  );
}
