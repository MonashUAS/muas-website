"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { searchDocuments } from "@/lib/search";
import type { SearchDocument, SearchTextContent } from "@/lib/search";
import { normalizeSearchText } from "@/lib/search/normalize";
import {
  useSearchNavigation,
  type SearchRangeHighlightRequest,
} from "./search-navigation-provider";

const semanticTextSelector = "h1, h2, h3, h4, h5, h6, p, li, blockquote, figcaption";
const rootSelector = ".page-dissolve-shell, #site-footer";
const rangeHighlightName = "search-active-range-highlight";

function getSearchRoots() {
  const roots = Array.from(
    window.document.querySelectorAll<HTMLElement>(rootSelector),
  );

  return roots.length > 0 ? roots : [window.document.body];
}

function getElementsFromRoots(selector: string) {
  const seen = new Set<HTMLElement>();

  return getSearchRoots().flatMap((root) =>
    Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((element) => {
      if (seen.has(element)) {
        return false;
      }

      seen.add(element);
      return true;
    }),
  );
}

function isSearchVisible(element: HTMLElement) {
  if (
    element.hidden ||
    element.getClientRects().length === 0 ||
    element.closest("[aria-hidden='true'], [hidden], [inert], .sr-only") !== null
  ) {
    return false;
  }

  const style = window.getComputedStyle(element);

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    Number(style.opacity) > 0.01
  );
}

function getSemanticTextEntries(documentTargets: SearchDocument["targets"]) {
  return documentTargets.flatMap((target) =>
    target.text.flatMap((content): SearchTextContent[] => {
      if (typeof content === "string") {
        return [];
      }

      const highlightTargetId = content.highlightTargetId;
      const isTextTarget =
        content.targetType === "text" ||
        content.highlightMode === "text" ||
        Boolean(highlightTargetId);

      if (!highlightTargetId || !isTextTarget) {
        return [];
      }

      return [
        {
          ...content,
          componentTargetId: content.componentTargetId ?? target.id,
          highlightMode: content.highlightMode ?? "text",
          targetType: content.targetType ?? "text",
        },
      ];
    }),
  );
}

function getElementSearchText(element: HTMLElement) {
  return normalizeSearchText(element.textContent ?? "");
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
  const normalizedHighlightText = normalizeSearchText(highlightedText);

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

function applyCssRangeHighlight(
  element: HTMLElement,
  request: SearchRangeHighlightRequest,
  highlightName: string,
) {
  const cssHighlights = CSS as typeof CSS & {
    highlights?: {
      delete: (name: string) => void;
      set: (name: string, highlight: unknown) => void;
    };
  };
  const HighlightConstructor = (
    window as typeof window & { Highlight?: new (range: Range) => unknown }
  ).Highlight;

  if (!cssHighlights.highlights || !HighlightConstructor) {
    return false;
  }

  const range = getRangeForRequest(element, request);

  if (!range) {
    return false;
  }

  if (!document.getElementById("search-range-highlight-style")) {
    const style = document.createElement("style");
    style.id = "search-range-highlight-style";
    style.textContent = `
      ::highlight(${highlightName}) {
        background-color: rgb(var(--search-highlight-color) / 0.46);
        color: inherit;
      }
    `;
    document.head.append(style);
  }

  cssHighlights.highlights.delete(highlightName);
  cssHighlights.highlights.set(highlightName, new HighlightConstructor(range));
  return true;
}

export function SearchDomTargetRegistrar() {
  const pathname = usePathname();
  const { registerSearchTarget } = useSearchNavigation();

  useEffect(() => {
    const document = searchDocuments.find((entry) => entry.route === pathname);

    if (!document) {
      return;
    }

    const cleanups: Array<() => void> = [];
    const registeredIds = new Set<string>();
    const staticTargets = getElementsFromRoots("[data-search-target-id]").filter(
      (element) => element.dataset.searchManaged !== "true",
    );
    const targetIds = Array.from(
      new Set(
        staticTargets
          .map((element) => element.dataset.searchTargetId)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    for (const targetId of targetIds) {
      const element =
        staticTargets.find(
          (target) =>
            target.dataset.searchTargetId === targetId &&
            isSearchVisible(target),
        ) ??
        staticTargets.find((target) => target.dataset.searchTargetId === targetId);

      if (!element) {
        continue;
      }

      cleanups.push(
        registerSearchTarget(targetId, {
          element,
          highlightMode:
            element.dataset.searchHighlightMode === "text"
              ? "text"
              : "component",
        }),
      );
      registeredIds.add(targetId);
    }

    const semanticElements = getElementsFromRoots(semanticTextSelector).filter(
      (element) =>
        element.dataset.searchManaged !== "true" &&
        !element.dataset.searchTargetId &&
        isSearchVisible(element),
    );
    const semanticEntries = getSemanticTextEntries(document.targets);
    const consumedElements = new WeakSet<HTMLElement>();

    for (const entry of semanticEntries) {
      if (registeredIds.has(entry.highlightTargetId ?? "")) {
        continue;
      }

      const normalizedEntryText = normalizeSearchText(entry.text);

      if (!normalizedEntryText) {
        continue;
      }

      const element = semanticElements
        .filter((candidate) => !consumedElements.has(candidate))
        .filter((candidate) => {
          const candidateText = getElementSearchText(candidate);

          if (!candidateText) {
            return false;
          }

          return (
            candidateText === normalizedEntryText ||
            candidateText.includes(normalizedEntryText)
          );
        })
        .sort(
          (first, second) =>
            getElementSearchText(first).length - getElementSearchText(second).length,
        )[0];

      if (!element || !entry.highlightTargetId) {
        continue;
      }

      cleanups.push(
        registerSearchTarget(entry.highlightTargetId, {
          element,
          highlightMode: "text",
          isReady: () => isSearchVisible(element),
          applyRangeHighlight: (request) =>
            applyCssRangeHighlight(element, request, rangeHighlightName),
          fadeTextHighlight: () => undefined,
          clearTextHighlight: () => {
            const cssHighlights = CSS as typeof CSS & {
              highlights?: { delete: (name: string) => void };
            };

            cssHighlights.highlights?.delete(rangeHighlightName);
          },
        }),
      );
      consumedElements.add(element);
      registeredIds.add(entry.highlightTargetId);
    }

    for (const target of document.targets) {
      if (registeredIds.has(target.id)) {
        continue;
      }

      const hashTarget = target.hash
        ? window.document.getElementById(target.hash)
        : null;

      if (!hashTarget) {
        continue;
      }

      cleanups.push(
        registerSearchTarget(target.id, {
          element: hashTarget,
          highlightMode: "component",
        }),
      );
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [pathname, registerSearchTarget]);

  return null;
}
