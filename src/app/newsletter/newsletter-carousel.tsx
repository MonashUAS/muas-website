"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useSearchRevealController } from "@/global-components/search/search-navigation-provider";
import type { Newsletter } from "./newsletter-data";
import { NewsletterReaderModal } from "./newsletter-reader-modal";

type NewsletterCarouselProps = {
  newsletters: Newsletter[];
};

/**
 * Calculates position, transformation, and visibility offset for active and adjacent carousel slides.
 * Spreads adjacent cover slides further apart for improved visual separation.
 * @param isActive - Whether the slide is the currently selected active item.
 * @param isActiveHovered - Whether the active slide is hovered by user cursor.
 * @param offset - Relative slide offset distance (-2, -1, 0, 1, 2).
 * @returns CSS inline style object for standard portrait newsletter covers.
 */
function getNewsletterSlideStyle(
  isActive: boolean,
  isActiveHovered: boolean,
  offset: number,
) {
  const isOffscreen = Math.abs(offset) > 1;

  return {
    height: isActive ? "48vh" : "24vh",
    maxHeight: isActive ? "440px" : "210px",
    maxWidth: isActive ? "320px" : "150px",
    width: isActive ? "38vw" : "18vw",
    opacity: isOffscreen ? 0 : isActive ? 1 : 0.65,
    pointerEvents: isOffscreen ? ("none" as const) : ("auto" as const),
    transform: `translateX(${offset * 215}%) translateY(${
      isActive ? 20 : -35
    }px) scale(${
      isActive ? (isActiveHovered ? 1.05 : 1) : 0.84
    })`,
    zIndex: isActive ? 2 : 1,
  };
}

/**
 * Normalizes carousel slide indices around newsletter list bounds.
 * @param index - Target array index.
 * @param length - Total length of array.
 * @returns Wrapped index within valid range.
 */
function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/**
 * Obtains visible slide items with surrounding neighbours for smooth 3D carousel transitions.
 * @param items - Full array of newsletters.
 * @param activeIndex - Currently selected item index.
 * @returns Array of items with offset and index properties.
 */
function getVisibleNewsletters(items: Newsletter[], activeIndex: number) {
  return [-2, -1, 0, 1, 2].map((offset) => {
    const index = wrapIndex(activeIndex + offset, items.length);
    return {
      newsletter: items[index],
      index,
      offset,
    };
  });
}

/**
 * Renders the primary Newsletter 3D Cover Carousel.
 * Mirrors the 'our-drones' layout with dark blue radial background, date headings,
 * sleek chevron arrow navigation controls, and interactive modal reader trigger.
 */
export function NewsletterCarousel({ newsletters }: NewsletterCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);
  const [isActiveHovered, setIsActiveHovered] = useState(false);
  const carouselRef = useRef<HTMLElement | null>(null);

  const visibleNewsletters = useMemo(
    () => getVisibleNewsletters(newsletters, activeIndex),
    [activeIndex, newsletters],
  );

  const activeNewsletter = newsletters[activeIndex];

  /**
   * Updates carousel active index.
   * @param index - Desired target slide index.
   */
  const navigateTo = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, newsletters.length));
    },
    [newsletters.length],
  );

  // Keyboard navigation for carousel when reader modal is closed
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedNewsletter) return;
      if (e.key === "ArrowLeft") {
        navigateTo(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        navigateTo(activeIndex + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navigateTo, selectedNewsletter]);

  // Reset modal when clicking navigation links to /newsletter or any site link
  useEffect(() => {
    function handleNavLinkClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a");
      if (target) {
        setSelectedNewsletter(null);
      }
    }
    window.addEventListener("click", handleNavLinkClick);
    return () => window.removeEventListener("click", handleNavLinkClick);
  }, []);

  // Search controller registration for site-wide search reveal
  const searchController = useMemo(
    () => ({
      reveal: (state: {
        carousel?: { id: string; slideId: string };
        modal?: { id: string; itemId: string };
        interactions?: Array<{ type: string; groupId: string; value: string }>;
      }) => {
        const carouselInteraction = state.interactions?.find(
          (i) => i.type === "carousel" && i.groupId === "newsletter-carousel",
        );
        const modalInteraction = state.interactions?.find(
          (i) => i.type === "modal" && i.groupId === "newsletter-reader",
        );

        const requestedSlug =
          carouselInteraction?.value ??
          modalInteraction?.value ??
          (state.carousel?.id === "newsletter-carousel"
            ? state.carousel.slideId
            : null) ??
          (state.modal?.id === "newsletter-reader"
            ? state.modal.itemId
            : null);

        if (!requestedSlug) return;

        const nextIndex = newsletters.findIndex(
          (n) => n.slug === requestedSlug || n.id === requestedSlug,
        );
        const targetNewsletter = newsletters[nextIndex];

        if (!targetNewsletter) return;

        setActiveIndex(nextIndex);
        if (modalInteraction || state.modal?.id === "newsletter-reader") {
          setSelectedNewsletter(targetNewsletter);
        }
      },
    }),
    [newsletters],
  );

  useSearchRevealController("newsletter-carousel", searchController);
  useSearchRevealController("newsletter-reader", searchController);

  return (
    <section
      id="newsletter-page"
      ref={carouselRef}
      className="viewport-fold relative flex scroll-mt-20 flex-col items-center justify-between overflow-hidden bg-[radial-gradient(ellipse_at_center,#002352_0%,#020b18_55%,#00040a_100%)] px-4 py-4 sm:py-8 text-white min-h-screen"
    >
      {/* Header */}
      <div className="z-10 flex max-w-4xl flex-col items-center pt-4 text-center sm:pt-6">
        <h1
          id="newsletter-heading"
          className="text-[clamp(2.25rem,5.5vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white"
        >
          Explore Our Newsletters
        </h1>
      </div>

      {/* Active Newsletter Date and 3D Carousel */}
      <div className="relative z-10 my-auto flex w-full max-w-[1720px] flex-1 flex-col items-center justify-center py-2 sm:py-4">
        {/* Active Newsletter Date Display */}
        <button
          type="button"
          className={`mb-4 sm:mb-6 cursor-pointer text-balance text-[clamp(2.25rem,5vw,4.75rem)] font-medium leading-[0.9] tracking-[-0.04em] transition-colors duration-300 ${
            isActiveHovered ? "text-blue-400" : "text-blue-100 hover:text-blue-400"
          }`}
          onClick={() => setSelectedNewsletter(activeNewsletter)}
          aria-label={`Open ${activeNewsletter.date} newsletter reader`}
        >
          {activeNewsletter.date}
        </button>

        {/* Carousel Container */}
        <div className="relative flex min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] w-full items-center justify-center">
          {/* Navigation Controls (Chevron Arrows matching interactive mode design) */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 grid w-full -translate-y-1/2 grid-cols-[84px_minmax(0,1fr)_84px] items-center px-5 sm:grid-cols-[132px_minmax(0,1fr)_132px] sm:px-8 lg:px-12">
            <button
              type="button"
              onClick={() => navigateTo(activeIndex - 1)}
              className="pointer-events-auto inline-flex h-14 w-14 cursor-pointer items-center justify-center justify-self-center rounded-full bg-white/10 text-white backdrop-blur-md shadow-[0_14px_36px_rgba(0,0,0,0.4)] transition-all duration-300 hover:bg-blue-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none sm:h-16 sm:w-16"
              aria-label="Show previous newsletter"
            >
              <LuChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>

            <button
              type="button"
              onClick={() => navigateTo(activeIndex + 1)}
              className="pointer-events-auto col-start-3 inline-flex h-14 w-14 cursor-pointer items-center justify-center justify-self-center rounded-full bg-white/10 text-white backdrop-blur-md shadow-[0_14px_36px_rgba(0,0,0,0.4)] transition-all duration-300 hover:bg-blue-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none sm:h-16 sm:w-16"
              aria-label="Show next newsletter"
            >
              <LuChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>
          </div>

          {/* 3D Newsletter Cover Slides */}
          <div className="relative flex min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] w-full max-w-7xl items-center justify-center">
            {visibleNewsletters.map(({ newsletter, index, offset }) => {
              const isActive = offset === 0;

              return (
                <button
                  key={newsletter.id}
                  type="button"
                  aria-label={
                    isActive
                      ? `Read ${newsletter.date} Newsletter`
                      : `Show ${newsletter.date} Newsletter`
                  }
                  className="absolute flex cursor-pointer items-center justify-center overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/15 transition-all duration-700 ease-out"
                  onMouseEnter={() => setIsActiveHovered(isActive)}
                  onMouseLeave={() => setIsActiveHovered(false)}
                  onClick={() =>
                    isActive
                      ? setSelectedNewsletter(newsletter)
                      : navigateTo(index)
                  }
                  style={getNewsletterSlideStyle(
                    isActive,
                    isActiveHovered,
                    offset,
                  )}
                >
                  <div className="relative h-full w-full bg-slate-900">
                    <Image
                      src={newsletter.coverImage}
                      alt={`${newsletter.title} Cover`}
                      fill
                      sizes="(max-width: 768px) 50vw, 320px"
                      className="object-cover"
                      priority={isActive}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Reader Modal */}
      {selectedNewsletter ? (
        <NewsletterReaderModal
          newsletter={selectedNewsletter}
          onClose={() => setSelectedNewsletter(null)}
        />
      ) : null}
    </section>
  );
}
