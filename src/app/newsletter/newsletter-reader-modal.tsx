"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuMaximize2,
  LuX,
  LuZoomIn,
  LuZoomOut,
} from "react-icons/lu";
import type { Newsletter } from "./newsletter-data";

type NewsletterReaderModalProps = {
  newsletter: Newsletter;
  onClose: () => void;
};

/**
 * Calculates page spread pairs for a given total page count.
 * Single-page per spread on mobile viewports (<768px); 2-page spreads (after cover) on desktop.
 * @param pageCount - Total number of pages in the newsletter.
 * @param isMobile - Whether the user is on a small/mobile viewport.
 * @returns Array of page index arrays representing each spread.
 */
function calculateSpreads(pageCount: number, isMobile: boolean): number[][] {
  if (isMobile) {
    return Array.from({ length: pageCount }, (_, i) => [i]);
  }
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
 * @returns Formatted label string like "Page 1 of 11" or "Pages 2 - 3 of 11".
 */
function formatSpreadLabel(spread: number[], totalPages: number): string {
  if (spread.length === 1) {
    return `Page ${spread[0] + 1} of ${totalPages}`;
  }
  return `Pages ${spread[0] + 1} - ${spread[1] + 1} of ${totalPages}`;
}

/**
 * Interactive full-screen reader modal featuring page spreads (1 page on mobile, 2 pages on desktop),
 * click-to-zoom capabilities and responsive text headings.
 */
export function NewsletterReaderModal({
  newsletter,
  onClose,
}: NewsletterReaderModalProps) {
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Zoom state and drag-to-pan refs
  const [zoomedPageIndex, setZoomedPageIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1.5);
  const zoomViewportRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const scrollTopRef = useRef(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // Detect mobile viewport breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mount component and trigger smooth fade/scale entrance transition
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 20);
    return () => clearTimeout(timer);
  }, []);

  const spreads = useMemo(
    () => calculateSpreads(newsletter.pageCount, isMobile),
    [newsletter.pageCount, isMobile],
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

  /**
   * Opens zoomed full-screen view for a specific page index.
   * @param pageIdx - Zero-based page index to inspect.
   */
  const handleZoomPage = useCallback((pageIdx: number) => {
    setZoomedPageIndex(pageIdx);
    setZoomScale(1.5);
  }, []);

  /**
   * Closes full-screen page zoom view.
   */
  const handleCloseZoom = useCallback(() => {
    setZoomedPageIndex(null);
  }, []);

  /**
   * Toggles or adjusts zoom scale level (100% -> 150% -> 200% -> 250% -> 100%).
   */
  const toggleZoomScale = useCallback(() => {
    setZoomScale((prev) => (prev >= 2.5 ? 1 : prev + 0.5));
  }, []);

  /**
   * Increases zoom scale level up to 2.5x.
   */
  const handleZoomIn = useCallback(() => {
    setZoomScale((prev) => Math.min(2.5, +(prev + 0.5).toFixed(1)));
  }, []);

  /**
   * Decreases zoom scale level down to 1x.
   */
  const handleZoomOut = useCallback(() => {
    setZoomScale((prev) => Math.max(1, +(prev - 0.5).toFixed(1)));
  }, []);

  /**
   * Begins mouse or touch dragging gesture to pan the zoomed page container.
   * @param e - Mouse or touch pointer event.
   */
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!zoomViewportRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    startXRef.current = clientX;
    startYRef.current = clientY;
    scrollLeftRef.current = zoomViewportRef.current.scrollLeft;
    scrollTopRef.current = zoomViewportRef.current.scrollTop;

    setIsGrabbing(true);
  }, []);

  /**
   * Moves the viewport scroll position in real time as the cursor/finger drags.
   * @param e - Mouse or touch pointer event.
   */
  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || !zoomViewportRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - startXRef.current;
    const dy = clientY - startYRef.current;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasDraggedRef.current = true;
    }

    if (hasDraggedRef.current) {
      zoomViewportRef.current.scrollLeft = scrollLeftRef.current - dx;
      zoomViewportRef.current.scrollTop = scrollTopRef.current - dy;
    }
  }, []);

  /**
   * Concludes dragging gesture. If cursor did not drag, triggers click-to-zoom step.
   */
  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);

    if (!hasDraggedRef.current) {
      toggleZoomScale();
    }
  }, [toggleZoomScale]);

  // Keyboard navigation shortcuts (Left/Right arrows, Escape to exit/unzoom)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (zoomedPageIndex !== null) {
          setZoomedPageIndex(null);
        } else {
          handleClose();
        }
      } else if (event.key === "ArrowLeft") {
        if (zoomedPageIndex !== null) {
          setZoomedPageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
        } else {
          changeSpread(spreadIndex - 1);
        }
      } else if (event.key === "ArrowRight") {
        if (zoomedPageIndex !== null) {
          setZoomedPageIndex((prev) =>
            prev !== null && prev < newsletter.pageCount - 1 ? prev + 1 : prev,
          );
        } else {
          changeSpread(spreadIndex + 1);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeSpread, handleClose, newsletter.pageCount, spreadIndex, zoomedPageIndex]);

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
      {/* Reader Top Bar (Full heading display without truncation, un-squashed circular close button) */}
      <header className="flex h-14 sm:h-20 shrink-0 items-center justify-between border-b border-white/10 px-3 sm:px-8">
        <div className="flex flex-col text-white min-w-0 pr-2">
          <h2 className="text-xs sm:text-base md:text-lg font-semibold tracking-wide text-white whitespace-normal leading-snug">
            {newsletter.title}
          </h2>
          <p className="text-[10px] sm:text-xs font-medium text-blue-300">
            {newsletter.date}
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Download PDF Button */}
          <a
            href={newsletter.pdfUrl}
            download={`${newsletter.slug}-newsletter.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-blue-600/90 hover:bg-blue-600 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 shrink-0"
            aria-label={`Download ${newsletter.title} PDF`}
            title="Download PDF version"
          >
            <LuDownload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Download PDF</span>
            <span className="xs:hidden">PDF</span>
          </a>

          <span className="rounded-full bg-white/10 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-slate-200 whitespace-nowrap">
            {formatSpreadLabel(currentSpread, newsletter.pageCount)}
          </span>

          {/* Close 'X' Button cleanly aligned & strictly fixed circle shape */}
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 aspect-square cursor-pointer items-center justify-center rounded-full bg-white/10 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Close reader and return to carousel"
            title="Close reader (Esc)"
          >
            <LuX className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Reader Main Content Area */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden p-1 sm:p-6 lg:p-8">
        <div className="relative flex h-full w-full items-center justify-center gap-3 sm:gap-6 lg:gap-8">
          {/* Navigation Arrow Left */}
          <button
            type="button"
            onClick={() => changeSpread(spreadIndex - 1)}
            disabled={!canGoPrev}
            className={`flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xl ring-1 ring-white/15 transition-all duration-200 z-20 ${
              isMobile ? "absolute left-1 top-1/2 -translate-y-1/2" : ""
            } ${
              canGoPrev
                ? "cursor-pointer hover:scale-110 hover:bg-blue-600 opacity-90 hover:opacity-100"
                : "cursor-not-allowed opacity-20"
            }`}
            aria-label="Previous page spread"
          >
            <LuChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" />
          </button>

          {/* Spread Display Container */}
          <div
            className={`flex h-full w-full items-center justify-center transition-all duration-300 ${
              isMobile
                ? "max-h-[85vh] max-w-full"
                : currentSpread.length === 2
                  ? "max-h-[78vh] max-w-5xl lg:max-w-6xl"
                  : "max-h-[78vh] max-w-xs sm:max-w-md md:max-w-lg"
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
                  onClick={() => handleZoomPage(pageIdx)}
                  className="group relative flex h-full w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-lg bg-slate-900/60 shadow-2xl ring-1 ring-white/10 transition-all duration-200 hover:ring-blue-400/50"
                  title="Click to zoom in on this page"
                >
                  <Image
                    src={newsletter.pages[pageIdx]}
                    alt={`${newsletter.title} - Page ${pageIdx + 1}`}
                    fill
                    sizes={
                      isMobile
                        ? "100vw"
                        : currentSpread.length === 2
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 90vw, 500px"
                    }
                    className="object-contain"
                    priority={pageIdx <= 2}
                  />

                  {/* Subtle Zoom Hint Badge on Hover */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-blue-950/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md ring-1 ring-white/20">
                      <LuZoomIn className="h-4 w-4 text-blue-400" /> Click to Zoom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrow Right */}
          <button
            type="button"
            onClick={() => changeSpread(spreadIndex + 1)}
            disabled={!canGoNext}
            className={`flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xl ring-1 ring-white/15 transition-all duration-200 z-20 ${
              isMobile ? "absolute right-1 top-1/2 -translate-y-1/2" : ""
            } ${
              canGoNext
                ? "cursor-pointer hover:scale-110 hover:bg-blue-600 opacity-90 hover:opacity-100"
                : "cursor-not-allowed opacity-20"
            }`}
            aria-label="Next page spread"
          >
            <LuChevronRight className="h-5 w-5 sm:h-7 sm:w-7" />
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
          ‹ Previous Page
        </button>
        <div className="flex items-center gap-1.5 max-w-[200px] sm:max-w-none overflow-x-auto py-1">
          {spreads.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => changeSpread(i)}
              className={`h-2 rounded-full transition-all shrink-0 ${
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
          Next Page ›
        </button>
      </footer>

      {/* Full-Screen Page Zoom Overlay Portal */}
      {zoomedPageIndex !== null && (
        <div
          className="fixed inset-0 z-[120] flex flex-col bg-slate-950/98 backdrop-blur-xl animate-fadeIn select-none"
          role="dialog"
          aria-label={`Zoomed view for Page ${zoomedPageIndex + 1}`}
        >
          {/* Zoom Toolbar */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-3 sm:px-6 bg-slate-950/90">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="text-xs sm:text-sm font-medium text-white whitespace-normal">
                {newsletter.title}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Zoom Out Button */}
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomScale <= 1}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <LuZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Toggle Zoom Scale Button */}
              <button
                type="button"
                onClick={toggleZoomScale}
                className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-blue-300 transition-all hover:bg-white/20 hover:text-white"
                aria-label="Toggle zoom scale level"
                title="Toggle zoom scale"
              >
                <LuMaximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>{Math.round(zoomScale * 100)}%</span>
              </button>

              {/* Zoom In Button */}
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomScale >= 2.5}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30 hover:bg-white/20 transition-all"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <LuZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Close Zoom Button */}
              <button
                type="button"
                onClick={handleCloseZoom}
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 aspect-square cursor-pointer items-center justify-center rounded-full bg-white/10 text-white shadow-md transition-all hover:scale-105 hover:bg-red-600 focus:outline-none ml-1"
                aria-label="Close zoomed page view"
                title="Close zoom (Esc)"
              >
                <LuX className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
              </button>
            </div>
          </header>

          {/* Zoomable Image Scroll Container with Drag-to-Pan & Click-to-Zoom */}
          <div
            ref={zoomViewportRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className={`relative flex-1 overflow-auto p-4 sm:p-8 flex flex-col select-none transition-colors duration-200 ${
              isGrabbing
                ? "cursor-grabbing"
                : zoomScale > 1
                  ? "cursor-grab"
                  : "cursor-zoom-in"
            }`}
            onClick={(e) => {
              if (e.target === zoomViewportRef.current && !hasDraggedRef.current) {
                handleCloseZoom();
              }
            }}
          >
            <div
              className="relative transition-all duration-200 ease-out m-auto shrink-0 shadow-2xl rounded-md bg-slate-900"
              style={{
                width: isMobile ? `${zoomScale * 90}vw` : `${zoomScale * 75}vw`,
                height: isMobile ? `${zoomScale * 75}vh` : `${zoomScale * 82}vh`,
                aspectRatio: "1 / 1.414",
              }}
            >
              <Image
                src={newsletter.pages[zoomedPageIndex]}
                alt={`${newsletter.title} - Page ${zoomedPageIndex + 1} (Zoomed)`}
                fill
                sizes="100vw"
                className="object-contain rounded-md pointer-events-none"
                priority
              />
            </div>

            {/* Prev / Next Zoom Navigation Arrows */}
            {zoomedPageIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedPageIndex(zoomedPageIndex - 1);
                }}
                className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xl backdrop-blur-md ring-1 ring-white/15 transition-all hover:bg-blue-600 hover:scale-110"
                aria-label="Previous page in zoom view"
              >
                <LuChevronLeft className="h-6 w-6" />
              </button>
            )}
            {zoomedPageIndex < newsletter.pageCount - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedPageIndex(zoomedPageIndex + 1);
                }}
                className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-xl backdrop-blur-md ring-1 ring-white/15 transition-all hover:bg-blue-600 hover:scale-110"
                aria-label="Next page in zoom view"
              >
                <LuChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}

