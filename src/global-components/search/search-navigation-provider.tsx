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

function scrollToTarget(element: HTMLElement) {
  const top = element.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: Math.max(0, top - getHeaderOffset()),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
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
  const waitersRef = useRef(
    new Map<string, Array<(target: SearchTargetRegistration) => void>>(),
  );

  const registerSearchTarget = useCallback(
    (id: string, registration: SearchTargetRegistration) => {
      targetsRef.current.set(id, registration);

      const waiters = waitersRef.current.get(id);

      if (waiters && isSearchTargetReady(registration)) {
        waiters.forEach((resolve) => resolve(registration));
        waitersRef.current.delete(id);
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

  const waitForTarget = useCallback((id: string) => {
    const currentTarget = targetsRef.current.get(id);

    if (currentTarget && isSearchTargetReady(currentTarget)) {
      return Promise.resolve(currentTarget);
    }

    return new Promise<SearchTargetRegistration | null>((resolve) => {
      const timeout = window.setTimeout(() => {
        const waiters = waitersRef.current.get(id) ?? [];
        waitersRef.current.set(
          id,
          waiters.filter((waiter) => waiter !== wrappedResolve),
        );
        resolve(null);
      }, TARGET_WAIT_MS);

      const wrappedResolve = (target: SearchTargetRegistration) => {
        window.clearTimeout(timeout);
        resolve(target);
      };

      const waiters = waitersRef.current.get(id) ?? [];
      waitersRef.current.set(id, [...waiters, wrappedResolve]);
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

    const { destination, waitForRouteReady } = pendingNavigation;

    if (resolveRoute(pathname) !== resolveRoute(destination.route)) {
      return;
    }

    if (waitForRouteReady && routeReadyPathname !== pathname) {
      return;
    }

    await waitForPaint();
    await revealDestination(destination);
    await waitForPaint();

    const scrollTargetId = getDestinationScrollTargetId(destination);
    const highlightTargetId = getDestinationTargetId(destination);
    const scrollRegistration = await waitForTarget(scrollTargetId);
    const highlightRegistration =
      highlightTargetId === scrollTargetId
        ? scrollRegistration
        : await waitForTarget(highlightTargetId);
    const highlightMode = getDestinationHighlightMode(destination);
    const registration =
      highlightMode === "text"
        ? highlightRegistration
        : highlightRegistration ?? scrollRegistration;

    if (!registration) {
      setPendingNavigation(null);
      return;
    }

    clearActiveHighlight();
    scrollToTarget((scrollRegistration ?? registration).element);

    const matchQuery = destination.matchQuery ?? "";
    const rangeRequest =
      highlightMode === "text" && matchQuery && destination.content?.text
        ? {
            query: matchQuery,
            range: destination.matchRange,
            sourceText: destination.content.text,
          }
        : null;
    const usedRegistrationRangeHighlight =
      rangeRequest && registration.applyRangeHighlight?.(rangeRequest);
    const usedProviderRangeHighlight =
      rangeRequest &&
      !usedRegistrationRangeHighlight &&
      applyElementRangeHighlight(registration.element, rangeRequest);
    const usedRangeHighlight =
      usedRegistrationRangeHighlight || usedProviderRangeHighlight;
    const usedTextRangeHighlight =
      usedRangeHighlight ||
      (highlightMode === "text" &&
        matchQuery &&
        registration.applyTextHighlight?.(matchQuery));

    if (usedTextRangeHighlight) {
      registration.element.focus({ preventScroll: true });

      const fadeTimer = window.setTimeout(() => {
        registration.fadeTextHighlight?.();
      }, HIGHLIGHT_MS);
      const clearTimer = window.setTimeout(() => {
        registration.clearTextHighlight?.();
        deleteCssHighlight(PROVIDER_RANGE_HIGHLIGHT_NAME);
        activeHighlightCleanupRef.current = null;
      }, HIGHLIGHT_MS + 700);

      activeHighlightCleanupRef.current = () => {
        window.clearTimeout(fadeTimer);
        window.clearTimeout(clearTimer);
        registration.clearTextHighlight?.();
        deleteCssHighlight(PROVIDER_RANGE_HIGHLIGHT_NAME);
      };
    } else if (highlightMode === "text") {
      warnTextHighlightFailure(destination);
    } else {
      highlightTarget(registration.element, registration.highlightMode ?? "component");
    }

    setPendingNavigation(null);
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

  const navigateToSearchDestination = useCallback(
    (destination: SearchDestination) => {
      const isSameRoute =
        resolveRoute(pathname) === resolveRoute(destination.route);

      setPendingNavigation({
        destination,
        waitForRouteReady: !isSameRoute,
      });

      if (!isSameRoute) {
        dispatchSearchTransitionNavigation(destination.route);
      }
    },
    [pathname],
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
