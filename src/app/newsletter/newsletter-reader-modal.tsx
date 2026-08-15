"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import type { Newsletter } from "./newsletter-data";

type NewsletterReaderModalProps = {
  newsletter: Newsletter;
  onClose: () => void;
};

/**
 * Calculates page spread pairs (2-page side-by-side spreads) for a given total page count.
 * Cover page (Page 1) is displayed individually, followed by 2-page spreads.
 * @param pageCount - Total number of pages.
 * @returns Array of page index arrays representing each spread.
 */
function calculateSpreads(pageCount: number): number[][] {
  const spreads: number[][] = [[0]]; // Cover page alone
  for (let i = 1; i < pageCount; i += 2) {
    if (i + 1 < pageCount) {
      spreads.push([i, i + 1]);
    } else {
      spreads.push([i]);
    }
  }
  return spreads;
}

/**
 * Formats a human-readable page range string for the active spread.
 * @param spread - Array of zero-based page indices in current spread.
 * @param totalPages - Total number of pages in newsletter.
 * @returns Formatted label string like "Page 1 of 11" or "Pages 2-3 of 11".
 */
function formatSpreadLabel(spread: number[], totalPages: number): string {
  if (spread.length === 1) {
    return `Page ${spread[0] + 1} of ${totalPages}`;
  }
  return `Pages ${spread[0] + 1} - ${spread[1] + 1} of ${totalPages}`;
}

/**
 * Interactive full-screen reader modal featuring 2-page side-by-side page spreads,
 * smooth entrance/exit transitions, elevated header with 'X' close button, and arrow controls
 * positioned right alongside the spread pages.
 */
export function NewsletterReaderModal({
  newsletter,
  onClose,
}: NewsletterReaderModalProps) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mount component and trigger smooth fade/scale entrance transition
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 20);
    return () => clearTimeout(timer);
  }, []);

  const spreads = useMemo(
    () => calculateSpreads(newsletter.pageCount),
    [newsletter.pageCount],
  );

  const currentSpread = spreads[spreadIndex] || [0];
  const canGoPrev = spreadIndex > 0;
  const canGoNext = spreadIndex < spreads.length - 1;

  /**
   * Smoothly closes the modal with an exit fade animation.
   */
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 220);
  }, [onClose]);

  /**
   * Navigates to a target spread index with a brief animation effect.
   * @param nextIndex - Index of destination spread.
   */
  const changeSpread = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= spreads.length || isFlipping) return;
      setIsFlipping(true);
      setSpreadIndex(nextIndex);
      setTimeout(() => setIsFlipping(false), 250);
    },
    [isFlipping, spreads.length],
  );

  // Keyboard navigation shortcuts (Left/Right arrows, Escape to exit)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      } else if (event.key === "ArrowLeft") {
        changeSpread(spreadIndex - 1);
      } else if (event.key === "ArrowRight") {
        changeSpread(spreadIndex + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeSpread, handleClose, spreadIndex]);

  // Lock body scroll while reader is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-slate-950/98 backdrop-blur-md transition-all duration-300 ease-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${newsletter.title}`}
    >
      {/* Reader Top Bar (h-20 ensures generous spacing so line never overlaps 'X' button) */}
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-8">
        <div className="flex flex-col text-white">
          <h2 className="text-base font-semibold tracking-wide text-white sm:text-lg">
            {newsletter.title}
          </h2>
          <p className="text-xs font-medium text-blue-300">
            {newsletter.date}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200">
            {formatSpreadLabel(currentSpread, newsletter.pageCount)}
          </span>

          {/* Close 'X' Button cleanly aligned inside header */}
          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Close reader and return to carousel"
            title="Close reader (Esc)"
          >
            <LuX className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Reader Main Content Area */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden p-2 sm:p-6 lg:p-8">
        <div className="flex h-full w-full items-center justify-center gap-3 sm:gap-6 lg:gap-8">
          {/* Navigation Arrow Left positioned next to spread */}
          <button
            type="button"
            onClick={() => changeSpread(spreadIndex - 1)}
            disabled={!canGoPrev}
            className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xl ring-1 ring-white/15 transition-all duration-200 sm:h-14 sm:w-14 ${
              canGoPrev
                ? "cursor-pointer hover:scale-110 hover:bg-blue-600"
                : "cursor-not-allowed opacity-20"
            }`}
            aria-label="Previous page spread"
          >
            <LuChevronLeft className="h-7 w-7" />
          </button>

          {/* Spread Display Container */}
          <div
            className={`flex h-full max-h-[78vh] w-full items-center justify-center transition-all duration-300 ${
              currentSpread.length === 2
                ? "max-w-5xl lg:max-w-6xl"
                : "max-w-xs sm:max-w-md md:max-w-lg"
            } ${isFlipping ? "scale-95 opacity-60" : "scale-100 opacity-100"}`}
          >
            <div
              className={`grid h-full w-full items-center justify-center gap-2 sm:gap-4 ${
                currentSpread.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {currentSpread.map((pageIdx) => (
                <div
                  key={pageIdx}
                  className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-slate-900/60 shadow-2xl ring-1 ring-white/10"
                >
                  <Image
                    src={newsletter.pages[pageIdx]}
                    alt={`${newsletter.title} - Page ${pageIdx + 1}`}
                    fill
                    sizes={
                      currentSpread.length === 2
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 90vw, 500px"
                    }
                    className="object-contain"
                    priority={pageIdx <= 2}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrow Right positioned next to spread */}
          <button
            type="button"
            onClick={() => changeSpread(spreadIndex + 1)}
            disabled={!canGoNext}
            className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xl ring-1 ring-white/15 transition-all duration-200 sm:h-14 sm:w-14 ${
              canGoNext
                ? "cursor-pointer hover:scale-110 hover:bg-blue-600"
                : "cursor-not-allowed opacity-20"
            }`}
            aria-label="Next page spread"
          >
            <LuChevronRight className="h-7 w-7" />
          </button>
        </div>
      </main>

      {/* Reader Bottom Navigation Toolbar */}
      <footer className="flex h-14 shrink-0 items-center justify-center gap-4 border-t border-white/10 px-4">
        <button
          type="button"
          onClick={() => changeSpread(spreadIndex - 1)}
          disabled={!canGoPrev}
          className="text-xs font-medium text-slate-300 disabled:opacity-30 hover:text-white"
        >
          ‹ Previous Spread
        </button>
        <div className="flex items-center gap-1.5">
          {spreads.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => changeSpread(i)}
              className={`h-2 rounded-full transition-all ${
                i === spreadIndex
                  ? "w-6 bg-blue-500"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to spread ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => changeSpread(spreadIndex + 1)}
          disabled={!canGoNext}
          className="text-xs font-medium text-slate-300 disabled:opacity-30 hover:text-white"
        >
          Next Spread ›
        </button>
      </footer>
    </div>,
    document.body,
  );
}
