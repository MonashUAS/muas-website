"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  readHighlightQuery,
  stripHighlightParam,
} from "@/lib/search-highlight-url";

const HIGHLIGHT_DURATION_MS = 2600;
const HIGHLIGHT_FADE_MS = 700;

function getHighlightRoot() {
  const hash = window.location.hash.slice(1);

  if (hash) {
    const anchorTarget = document.getElementById(hash);

    if (anchorTarget) {
      return anchorTarget;
    }
  }

  return document.querySelector("main") ?? document.body;
}

function highlightFirstMatch(root: HTMLElement, query: string) {
  const normalizedQuery = query.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  let currentNode = walker.nextNode();

  while (currentNode) {
    const textNode = currentNode as Text;
    const text = textNode.textContent ?? "";
    const matchIndex = text.toLowerCase().indexOf(normalizedQuery);

    if (matchIndex !== -1 && textNode.parentElement) {
      const parent = textNode.parentElement;

      if (parent.closest("[data-search-highlight-ignore]")) {
        currentNode = walker.nextNode();
        continue;
      }

      const before = text.slice(0, matchIndex);
      const match = text.slice(matchIndex, matchIndex + query.length);
      const after = text.slice(matchIndex + query.length);
      const highlight = document.createElement("span");

      highlight.className = "search-match-highlight";
      highlight.textContent = match;
      highlight.dataset.searchHighlight = "active";

      const fragment = document.createDocumentFragment();

      if (before) {
        fragment.appendChild(document.createTextNode(before));
      }

      fragment.appendChild(highlight);

      if (after) {
        fragment.appendChild(document.createTextNode(after));
      }

      parent.replaceChild(fragment, textNode);
      highlight.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      return highlight;
    }

    currentNode = walker.nextNode();
  }

  return null;
}

function removeHighlight(mark: HTMLElement) {
  const parent = mark.parentNode;

  if (!parent) {
    return;
  }

  parent.replaceChild(document.createTextNode(mark.textContent ?? ""), mark);
  parent.normalize();
}

function cleanupHighlightParam() {
  const nextSearch = stripHighlightParam(
    new URLSearchParams(window.location.search),
  );
  const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;

  window.history.replaceState(window.history.state, "", nextUrl);
}

// Flashes the first on-page match after navigating from global search.
export function SearchMatchHighlight() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const highlightQuery = readHighlightQuery(searchParams);
  const activeMarkRef = useRef<HTMLElement | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];

    if (activeMarkRef.current) {
      removeHighlight(activeMarkRef.current);
      activeMarkRef.current = null;
    }

    if (!highlightQuery) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const runHighlight = () => {
      const root = getHighlightRoot();

      if (!(root instanceof HTMLElement)) {
        cleanupHighlightParam();
        return;
      }

      const mark = highlightFirstMatch(root, highlightQuery);

      if (!mark) {
        cleanupHighlightParam();
        return;
      }

      activeMarkRef.current = mark;

      const fadeTimer = window.setTimeout(() => {
        mark.classList.add("search-match-highlight-fading");
      }, HIGHLIGHT_DURATION_MS);

      const removeTimer = window.setTimeout(() => {
        if (activeMarkRef.current === mark) {
          removeHighlight(mark);
          activeMarkRef.current = null;
        }

        cleanupHighlightParam();
      }, HIGHLIGHT_DURATION_MS + HIGHLIGHT_FADE_MS);

      timersRef.current.push(fadeTimer, removeTimer);

      if (prefersReducedMotion) {
        mark.classList.add("search-match-highlight-reduced");
      }
    };

    const startTimer = window.setTimeout(runHighlight, 120);
    timersRef.current.push(startTimer);

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];

      if (activeMarkRef.current) {
        removeHighlight(activeMarkRef.current);
        activeMarkRef.current = null;
      }
    };
  }, [highlightQuery, pathname, searchParams]);

  return null;
}
