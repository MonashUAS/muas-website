"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import type {
  SearchDestination,
  SearchHighlightMode,
  SearchInteraction,
  SearchMatchRange,
  SearchRevealState,
} from "@/lib/search";
import {
  dispatchSearchTransitionNavigation,
  SEARCH_ROUTE_READY_EVENT,
} from "@/lib/search/navigation-events";

const HIGHLIGHT_MS = 2600;
const TARGET_WAIT_MS = 4500;
const SCROLL_STABLE_FRAMES = 3;
const PROVIDER_RANGE_HIGHLIGHT_NAME = "search-active-range-highlight";
const PROVIDER_RANGE_OVERLAY_ID = "search-active-range-highlight-overlay";

type SearchController = {
  reveal: (state: SearchRevealRequest) => void | Promise<void>;
};

export type SearchRangeHighlightRequest = {
  query: string;
  range?: SearchMatchRange;
  sourceText: string;
};

type SearchTargetRegistration = {
  element: HTMLElement;
  highlightMode?: SearchHighlightMode;
  isReady?: () => boolean;
  applyRangeHighlight?: (request: SearchRangeHighlightRequest) => boolean;
  applyTextHighlight?: (query: string) => boolean;
  fadeTextHighlight?: () => void;
  clearTextHighlight?: () => void;
};

type SearchRevealRequest = SearchRevealState & {
  interactions?: SearchInteraction[];
};

type PendingSearchNavigation = {
  destination: SearchDestination;
  id: number;
  waitForRouteReady: boolean;
};

type SearchNavigationContextValue = {
  navigateToSearchDestination: (destination: SearchDestination) => void;
  registerSearchController: (id: string, controller: SearchController) => () => void;
  registerSearchTarget: (
    id: string,
    registration: SearchTargetRegistration,
  ) => () => void;
};

const SearchNavigationContext =
  createContext<SearchNavigationContextValue | null>(null);

function resolveRoute(route: string) {
  return route === "/" ? "/" : route.replace(/\/$/, "");
}

function getHeaderOffset() {
  const header = document.querySelector("header");
  const headerHeight =
    header instanceof HTMLElement ? header.getBoundingClientRect().height : 80;

  return headerHeight + 24;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToTarget(element: HTMLElement) {
  const top = Math.max(
    0,
    element.getBoundingClientRect().top + window.scrollY - getHeaderOffset(),
  );

  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });

  return top;
}

function isNearScrollTarget(targetTop: number) {
  return Math.abs(window.scrollY - targetTop) <= 1;
}

function isRectInViewport(rect: DOMRectReadOnly) {
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

function isFixedHighlightInViewport() {
  const overlay = window.document.getElementById(PROVIDER_RANGE_OVERLAY_ID);

  if (!overlay) {
    return false;
  }

  return Array.from(
    overlay.querySelectorAll<HTMLElement>(".search-range-highlight-overlay"),
  ).some((segment) => isRectInViewport(segment.getBoundingClientRect()));
}

function isElementHighlightInViewport(element: HTMLElement) {
  return isRectInViewport(element.getBoundingClientRect());
}

function waitForScrollSettled(
  isActive: () => boolean,
  targetTop: number,
) {
  return new Promise<boolean>((resolve) => {
    if (!isActive()) {
      resolve(false);
      return;
    }

    const maxScrollTop = Math.max(
      0,
      window.document.documentElement.scrollHeight - window.innerHeight,
    );
    const effectiveTargetTop = Math.min(targetTop, maxScrollTop);

    if (prefersReducedMotion() || isNearScrollTarget(effectiveTargetTop)) {
      void waitForPaint().then(() => resolve(isActive()));
      return;
    }

    let settled = false;
    let animationFrame = 0;
    let lastY = window.scrollY;
    let stableFrames = 0;

    const finish = (success: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("scrollend", onScrollEnd);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      resolve(success);
    };

    const onScrollEnd = () => {
      void waitForPaint().then(() => finish(isActive()));
    };

    window.addEventListener("scrollend", onScrollEnd, { once: true });

    const checkStability = () => {
      if (settled) {
        return;
      }

      if (!isActive()) {
        finish(false);
        return;
      }

      if (window.scrollY === lastY) {
        stableFrames += 1;

        if (
          stableFrames >= SCROLL_STABLE_FRAMES &&
          isNearScrollTarget(effectiveTargetTop)
        ) {
          void waitForPaint().then(() => finish(isActive()));
          return;
        }
      } else {
        stableFrames = 0;
        lastY = window.scrollY;
      }

      animationFrame = window.requestAnimationFrame(checkStability);
    };

    const timeout = window.setTimeout(() => {
      void waitForPaint().then(() => finish(isActive()));
    }, TARGET_WAIT_MS);

    animationFrame = window.requestAnimationFrame(checkStability);
  });
}

function waitForHighlightRetryOpportunity(
  isActive: () => boolean,
  timeoutMs: number,
) {
  return new Promise<boolean>((resolve) => {
    if (!isActive() || timeoutMs <= 0) {
      resolve(false);
      return;
    }

    let settled = false;

    const finish = (success: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("scrollend", onOpportunity);
      mutationObserver.disconnect();
      resolve(success);
    };

    const onOpportunity = () => {
      void waitForPaint().then(() => finish(isActive()));
    };

    const mutationObserver = new MutationObserver(onOpportunity);
    mutationObserver.observe(window.document.body, {
      attributeFilter: ["aria-hidden", "class", "hidden", "inert", "style"],
      attributes: true,
      childList: true,
      subtree: true,
    });
    window.addEventListener("scrollend", onOpportunity, { once: true });

    const timeout = window.setTimeout(() => {
      finish(isActive());
    }, timeoutMs);
  });
}

function highlightTarget(
  element: HTMLElement,
  highlightMode: SearchHighlightMode,
) {
  const previousTabIndex = element.getAttribute("tabindex");
  const hadTabIndex = element.hasAttribute("tabindex");

  if (!hadTabIndex) {
    element.setAttribute("tabindex", "-1");
  }

  element.focus({ preventScroll: true });
  const highlightClass =
    highlightMode === "text"
      ? "search-text-highlight"
      : "search-target-highlight";
  const fadingClass =
    highlightMode === "text"
      ? "search-text-highlight-fading"
      : "search-target-highlight-fading";

  element.classList.add(highlightClass);

  window.setTimeout(() => {
    element.classList.add(fadingClass);
  }, HIGHLIGHT_MS);

  window.setTimeout(() => {
    element.classList.remove(highlightClass, fadingClass);

    if (hadTabIndex && previousTabIndex !== null) {
      element.setAttribute("tabindex", previousTabIndex);
    } else {
      element.removeAttribute("tabindex");
    }
  }, HIGHLIGHT_MS + 700);
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function getNormalizedTextWithOffsets(value: string) {
  let normalized = "";
  const offsets: number[] = [];
  let lastWasSpace = true;

  for (let index = 0; index < value.length; index += 1) {
    const normalizedCharacter = value[index]
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]/g, "");

    if (!normalizedCharacter) {
      continue;
    }

    if (/^[a-z0-9]$/.test(normalizedCharacter)) {
      normalized += normalizedCharacter;
      offsets.push(index);
      lastWasSpace = false;
      continue;
    }

    if (!lastWasSpace) {
      normalized += " ";
      offsets.push(index);
      lastWasSpace = true;
    }
  }

  if (normalized.endsWith(" ")) {
    normalized = normalized.slice(0, -1);
    offsets.pop();
  }

  return { normalized, offsets };
}

function getTextPosition(
  element: HTMLElement,
  offset: number,
): { node: Text; offset: number } | null {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const nextOffset = currentOffset + textNode.data.length;

    if (offset <= nextOffset) {
      return {
        node: textNode,
        offset: Math.max(0, offset - currentOffset),
      };
    }

    currentOffset = nextOffset;
    node = walker.nextNode();
  }

  return null;
}

function getCssHighlights() {
  return (CSS as typeof CSS & {
    highlights?: {
      delete: (name: string) => void;
      set: (name: string, highlight: unknown) => void;
    };
  }).highlights;
}

function deleteRangeOverlay() {
  window.document.getElementById(PROVIDER_RANGE_OVERLAY_ID)?.remove();
}

function deleteCssHighlight(name: string) {
  getCssHighlights()?.delete(name);
  deleteRangeOverlay();
}

function getRangeForRequest(
  element: HTMLElement,
  request: SearchRangeHighlightRequest,
) {
  const elementText = element.textContent ?? "";
  const highlightedText =
    request.range &&
    request.range.start >= 0 &&
    request.range.end <= request.sourceText.length
      ? request.sourceText.slice(request.range.start, request.range.end)
      : request.query;
  const normalizedHighlightText =
    getNormalizedTextWithOffsets(highlightedText).normalized ||
    getNormalizedTextWithOffsets(request.query).normalized;

  if (!normalizedHighlightText) {
    return null;
  }

  const { normalized, offsets } = getNormalizedTextWithOffsets(elementText);
  const normalizedStart = normalized.indexOf(normalizedHighlightText);

  if (normalizedStart < 0) {
    return null;
  }

  const normalizedEnd = normalizedStart + normalizedHighlightText.length - 1;
  const flatStart = offsets[normalizedStart];
  const flatEnd = offsets[normalizedEnd];

  if (flatStart === undefined || flatEnd === undefined) {
    return null;
  }

  const start = getTextPosition(element, flatStart);
  const end = getTextPosition(element, flatEnd + 1);

  if (!start || !end) {
    return null;
  }

  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);

  return range;
}

function applyElementRangeHighlight(
  element: HTMLElement,
  request: SearchRangeHighlightRequest,
) {
  const range = getRangeForRequest(element, request);

  if (!range) {
    return false;
  }

  const rects = Array.from(range.getClientRects()).filter(
    (rect) => rect.width > 0 && rect.height > 0,
  );

  if (rects.length === 0) {
    return false;
  }

  deleteCssHighlight(PROVIDER_RANGE_HIGHLIGHT_NAME);

  const overlay = document.createElement("div");
  overlay.id = PROVIDER_RANGE_OVERLAY_ID;
  overlay.setAttribute("aria-hidden", "true");

  for (const rect of rects) {
    const segment = document.createElement("span");
    segment.className = "search-range-highlight-overlay";
    segment.style.left = `${rect.left}px`;
    segment.style.top = `${rect.top}px`;
    segment.style.width = `${rect.width}px`;
    segment.style.height = `${rect.height}px`;
    overlay.append(segment);
  }

  document.body.append(overlay);
  return true;
}

function isControllerId(value: string | undefined): value is string {
  return Boolean(value);
}

function isSearchTargetReady(registration: SearchTargetRegistration) {
  return registration.isReady ? registration.isReady() : true;
}

function getInteractions(destination: SearchDestination) {
  const interaction = destination.target.interaction;

  return Array.isArray(interaction)
    ? interaction
    : interaction
      ? [interaction]
      : [];
}

function getLegacyRevealInteractions(reveal?: SearchRevealState) {
  const interactions: SearchInteraction[] = [];

  if (reveal?.carousel) {
    interactions.push({
      type: "carousel",
      groupId: reveal.carousel.id,
      value: reveal.carousel.slideId,
    });
  }

  if (reveal?.expand) {
    interactions.push({
      type: "accordion",
      groupId: reveal.expand.id,
      value: reveal.expand.itemId,
    });
  }

  if (reveal?.modal) {
    interactions.push({
      type: "modal",
      groupId: reveal.modal.id,
      value: reveal.modal.itemId,
    });
  }

  return interactions;
}

function getDestinationTargetId(destination: SearchDestination) {
  return (
    destination.textTargetId ??
    destination.content?.highlightTargetId ??
    destination.target.id
  );
}

function getDestinationScrollTargetId(destination: SearchDestination) {
  return (
    destination.scrollTargetId ??
    destination.componentTargetId ??
    destination.content?.componentTargetId ??
    destination.target.id
  );
}

function getDestinationHighlightMode(destination: SearchDestination) {
  if (destination.targetType) {
    return destination.targetType;
  }

  if (destination.content?.targetType) {
    return destination.content.targetType;
  }

  if (destination.content?.highlightMode) {
    return destination.content.highlightMode;
  }

  return destination.content?.highlightTargetId ? "text" : "component";
}

function warnTextHighlightFailure(destination: SearchDestination) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.warn("Search text highlight skipped because no exact range was available.", {
    query: destination.matchQuery,
    targetId: destination.target.id,
    textTargetId: destination.textTargetId,
    contentId: destination.content?.id,
  });
}

export function SearchNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [routeReadyPathname, setRouteReadyPathname] = useState(pathname);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingSearchNavigation | null>(null);
  const targetsRef = useRef(new Map<string, SearchTargetRegistration>());
  const controllersRef = useRef(new Map<string, SearchController>());
  const activeHighlightCleanupRef = useRef<(() => void) | null>(null);
  const activeNavigationIdRef = useRef(0);
  const previousPathnameRef = useRef(pathname);
  const waitersRef = useRef(
    new Map<string, Set<() => void>>(),
  );

  const registerSearchTarget = useCallback(
    (id: string, registration: SearchTargetRegistration) => {
      targetsRef.current.set(id, registration);

      const waiters = waitersRef.current.get(id);

      if (waiters) {
        waiters.forEach((notify) => notify());
      }

      return () => {
        if (targetsRef.current.get(id) === registration) {
          targetsRef.current.delete(id);
        }
      };
    },
    [],
  );

  const registerSearchController = useCallback(
    (id: string, controller: SearchController) => {
      controllersRef.current.set(id, controller);

      return () => {
        if (controllersRef.current.get(id) === controller) {
          controllersRef.current.delete(id);
        }
      };
    },
    [],
  );

  const clearActiveHighlight = useCallback(() => {
    activeHighlightCleanupRef.current?.();
    activeHighlightCleanupRef.current = null;
    deleteCssHighlight(PROVIDER_RANGE_HIGHLIGHT_NAME);
  }, []);

  const waitForTarget = useCallback((id: string, navigationId: number) => {
    const currentTarget = targetsRef.current.get(id);

    if (
      activeNavigationIdRef.current === navigationId &&
      currentTarget &&
      isSearchTargetReady(currentTarget)
    ) {
      return Promise.resolve(currentTarget);
    }

    return new Promise<SearchTargetRegistration | null>((resolve) => {
      let animationFrame = 0;
      let settled = false;
      const waiters = waitersRef.current.get(id) ?? new Set<() => void>();

      const cleanup = () => {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
        }

        window.clearTimeout(timeout);
        mutationObserver.disconnect();
        waiters.delete(checkTarget);

        if (waiters.size === 0) {
          waitersRef.current.delete(id);
        }
      };

      const settle = (target: SearchTargetRegistration | null) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        resolve(target);
      };

      const checkTarget = () => {
        if (settled) {
          return;
        }

        if (activeNavigationIdRef.current !== navigationId) {
          settle(null);
          return;
        }

        const target = targetsRef.current.get(id);

        if (target && isSearchTargetReady(target)) {
          settle(target);
          return;
        }

        animationFrame = window.requestAnimationFrame(checkTarget);
      };

      const timeout = window.setTimeout(() => {
        settle(null);
      }, TARGET_WAIT_MS);
      const mutationObserver = new MutationObserver(checkTarget);

      waiters.add(checkTarget);
      waitersRef.current.set(id, waiters);
      mutationObserver.observe(window.document.body, {
        attributeFilter: ["aria-hidden", "class", "hidden", "inert", "style"],
        attributes: true,
        childList: true,
        subtree: true,
      });
      animationFrame = window.requestAnimationFrame(checkTarget);
    });
  }, []);

  const revealDestination = useCallback(async (destination: SearchDestination) => {
    const reveal = destination.target.reveal;
    const interactions = [
      ...getLegacyRevealInteractions(reveal),
      ...getInteractions(destination),
    ];

    if (!reveal && interactions.length === 0) {
      return;
    }

    const controllerIds = [
      reveal?.carousel?.id,
      reveal?.expand?.id,
      reveal?.modal?.id,
      ...interactions.map((interaction) => interaction.groupId),
    ].filter(isControllerId);
    const uniqueControllerIds = Array.from(new Set(controllerIds));

    for (const controllerId of uniqueControllerIds) {
      const controller = controllersRef.current.get(controllerId);

      if (controller) {
        await controller.reveal({
          ...reveal,
          interactions,
        });
      }
    }
  }, []);

  const runPendingNavigation = useCallback(async () => {
    if (!pendingNavigation) {
      return;
    }

    const { destination, id, waitForRouteReady } = pendingNavigation;

    if (resolveRoute(pathname) !== resolveRoute(destination.route)) {
      return;
    }

    if (waitForRouteReady && routeReadyPathname !== pathname) {
      return;
    }

    await waitForPaint();

    if (activeNavigationIdRef.current !== id) {
      return;
    }

    await revealDestination(destination);
    await waitForPaint();

    if (activeNavigationIdRef.current !== id) {
      return;
    }

    const scrollTargetId = getDestinationScrollTargetId(destination);
    const highlightTargetId = getDestinationTargetId(destination);
    const scrollRegistration = await waitForTarget(scrollTargetId, id);

    if (activeNavigationIdRef.current !== id) {
      return;
    }

    const highlightRegistration =
      highlightTargetId === scrollTargetId
        ? scrollRegistration
        : await waitForTarget(highlightTargetId, id);

    if (activeNavigationIdRef.current !== id) {
      return;
    }

    const highlightMode = getDestinationHighlightMode(destination);
    const registration =
      highlightMode === "text"
        ? highlightRegistration
        : highlightRegistration ?? scrollRegistration;

    if (!registration) {
      setPendingNavigation(null);
      return;
    }

    const isActiveNavigation = () => activeNavigationIdRef.current === id;

    clearActiveHighlight();
    const targetScrollTop = scrollToTarget(
      (scrollRegistration ?? registration).element,
    );

    const scrollSettled = await waitForScrollSettled(
      isActiveNavigation,
      targetScrollTop,
    );

    if (!scrollSettled || !isActiveNavigation()) {
      return;
    }

    const matchQuery = destination.matchQuery ?? "";
    const rangeRequest =
      highlightMode === "text" && matchQuery && destination.content?.text
        ? {
            query: matchQuery,
            range: destination.matchRange,
            sourceText: destination.content.text,
          }
        : null;

    const tryApplyTextHighlight = (
      activeRegistration: SearchTargetRegistration,
    ) => {
      clearActiveHighlight();

      const usedRegistrationRangeHighlight = Boolean(
        rangeRequest && activeRegistration.applyRangeHighlight?.(rangeRequest),
      );
      const usedProviderRangeHighlight = Boolean(
        rangeRequest &&
          !usedRegistrationRangeHighlight &&
          applyElementRangeHighlight(activeRegistration.element, rangeRequest),
      );
      const usedRangeHighlight =
        usedRegistrationRangeHighlight || usedProviderRangeHighlight;
      const usedTextRangeHighlight =
        usedRangeHighlight ||
        Boolean(
          highlightMode === "text" &&
            matchQuery &&
            activeRegistration.applyTextHighlight?.(matchQuery),
        );

      if (!usedTextRangeHighlight) {
        return false;
      }

      activeRegistration.element.focus({ preventScroll: true });

      const fadeTimer = window.setTimeout(() => {
        activeRegistration.fadeTextHighlight?.();
      }, HIGHLIGHT_MS);
      const clearTimer = window.setTimeout(() => {
        activeRegistration.clearTextHighlight?.();
        deleteCssHighlight(PROVIDER_RANGE_HIGHLIGHT_NAME);
        activeHighlightCleanupRef.current = null;
      }, HIGHLIGHT_MS + 700);

      activeHighlightCleanupRef.current = () => {
        window.clearTimeout(fadeTimer);
        window.clearTimeout(clearTimer);
        activeRegistration.clearTextHighlight?.();
        deleteCssHighlight(PROVIDER_RANGE_HIGHLIGHT_NAME);
      };

      const acknowledged =
        isFixedHighlightInViewport() ||
        isElementHighlightInViewport(activeRegistration.element);

      if (!acknowledged) {
        clearActiveHighlight();
      }

      return acknowledged;
    };

    let highlightAcknowledged = false;

    if (highlightMode === "text") {
      highlightAcknowledged = tryApplyTextHighlight(registration);

      const highlightDeadline = Date.now() + TARGET_WAIT_MS;

      while (
        !highlightAcknowledged &&
        isActiveNavigation() &&
        Date.now() < highlightDeadline
      ) {
        const canRetry = await waitForHighlightRetryOpportunity(
          isActiveNavigation,
          highlightDeadline - Date.now(),
        );

        if (!canRetry || !isActiveNavigation()) {
          break;
        }

        const latestRegistration =
          targetsRef.current.get(highlightTargetId) ?? registration;

        if (!isSearchTargetReady(latestRegistration)) {
          continue;
        }

        highlightAcknowledged = tryApplyTextHighlight(latestRegistration);
      }

      if (!highlightAcknowledged) {
        warnTextHighlightFailure(destination);
      }
    } else {
      highlightTarget(
        registration.element,
        registration.highlightMode ?? "component",
      );
      highlightAcknowledged = true;
    }

    if (isActiveNavigation()) {
      setPendingNavigation(null);
    }
  }, [
    clearActiveHighlight,
    pathname,
    pendingNavigation,
    revealDestination,
    routeReadyPathname,
    waitForTarget,
  ]);

  useEffect(() => {
    const task = window.setTimeout(() => {
      void runPendingNavigation();
    }, 0);

    return () => window.clearTimeout(task);
  }, [runPendingNavigation]);

  useEffect(() => {
    const handleRouteReady = (event: Event) => {
      const routeReadyEvent = event as CustomEvent<{ pathname: string }>;

      if (routeReadyEvent.detail?.pathname) {
        setRouteReadyPathname(routeReadyEvent.detail.pathname);
      }
    };

    window.addEventListener(SEARCH_ROUTE_READY_EVENT, handleRouteReady);

    return () => {
      window.removeEventListener(SEARCH_ROUTE_READY_EVENT, handleRouteReady);
    };
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;

    if (!pendingNavigation) {
      activeNavigationIdRef.current += 1;
      clearActiveHighlight();
      return;
    }

    if (
      !pendingNavigation.waitForRouteReady &&
      resolveRoute(pathname) !== resolveRoute(pendingNavigation.destination.route)
    ) {
      const pendingNavigationId = pendingNavigation.id;

      activeNavigationIdRef.current += 1;
      clearActiveHighlight();
      const task = window.setTimeout(() => {
        setPendingNavigation((current) =>
          current?.id === pendingNavigationId ? null : current,
        );
      }, 0);

      return () => window.clearTimeout(task);
    }
  }, [clearActiveHighlight, pathname, pendingNavigation]);

  const navigateToSearchDestination = useCallback(
    (destination: SearchDestination) => {
      const isSameRoute =
        resolveRoute(pathname) === resolveRoute(destination.route);
      const id = activeNavigationIdRef.current + 1;

      activeNavigationIdRef.current = id;
      clearActiveHighlight();
      setPendingNavigation({
        destination,
        id,
        waitForRouteReady: !isSameRoute,
      });

      if (!isSameRoute) {
        dispatchSearchTransitionNavigation(destination.route);
      }
    },
    [clearActiveHighlight, pathname],
  );

  const value = useMemo(
    () => ({
      navigateToSearchDestination,
      registerSearchController,
      registerSearchTarget,
    }),
    [
      navigateToSearchDestination,
      registerSearchController,
      registerSearchTarget,
    ],
  );

  return (
    <SearchNavigationContext.Provider value={value}>
      {children}
    </SearchNavigationContext.Provider>
  );
}

export function useSearchNavigation() {
  const context = useContext(SearchNavigationContext);

  if (!context) {
    throw new Error("useSearchNavigation must be used inside SearchNavigationProvider");
  }

  return context;
}

export function useSearchTarget<TElement extends HTMLElement>(
  id: string,
  ref: RefObject<TElement | null> | MutableRefObject<TElement | null>,
) {
  const { registerSearchTarget } = useSearchNavigation();

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    return registerSearchTarget(id, { element });
  }, [id, ref, registerSearchTarget]);
}

export function useSearchRevealController(
  id: string,
  controller: SearchController,
) {
  const { registerSearchController } = useSearchNavigation();

  useEffect(() => registerSearchController(id, controller), [
    controller,
    id,
    registerSearchController,
  ]);
}
