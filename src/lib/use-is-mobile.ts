"use client";

import { useSyncExternalStore } from "react";

// subscribeIsMobile listens for viewport resize events matching max-width: 767px.
function subscribeIsMobile(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia("(max-width: 767px)");
  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

// getIsMobileSnapshot returns true if current viewport is smaller than 768px wide.
function getIsMobileSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 767px)").matches;
}

// getServerSnapshot provides SSR fallback snapshot for mobile state.
function getServerSnapshot() {
  return false;
}

// useIsMobile detects whether the current viewport width is in mobile range (<768px).
export function useIsMobile() {
  return useSyncExternalStore(
    subscribeIsMobile,
    getIsMobileSnapshot,
    getServerSnapshot,
  );
}
