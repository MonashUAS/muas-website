"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchRevealController } from "@/global-components/search/search-navigation-provider";
import type { Newsletter } from "./newsletter-data";
import { NewsletterReaderModal } from "./newsletter-reader-modal";

type NewsletterShelfProps = {
  newsletters: Newsletter[];
};

/**
 * NewsletterShelf renders an interactive bookshelf layout displaying published MUAS newsletters.
 * Displays a 3-column grid on desktop/laptop and 2-column grid on mobile viewports.
 * On hover, covers enlarge slightly and glow with a white edge shadow.
 */
export function NewsletterShelf({ newsletters }: NewsletterShelfProps) {
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<Newsletter | null>(null);

  // Search controller registration for site-wide search reveal
  const searchController = useMemo(
    () => ({
      reveal: (state: {
        carousel?: { id: string; slideId: string };
        shelf?: { id: string; itemId: string };
        modal?: { id: string; itemId: string };
        interactions?: Array<{ type: string; groupId: string; value: string }>;
      }) => {
        const shelfInteraction = state.interactions?.find(
          (i) =>
            (i.type === "shelf" || i.type === "carousel") &&
            (i.groupId === "newsletter-shelf" ||
              i.groupId === "newsletter-carousel"),
        );
        const modalInteraction = state.interactions?.find(
          (i) => i.type === "modal" && i.groupId === "newsletter-reader",
        );

        const requestedSlug =
          shelfInteraction?.value ??
          modalInteraction?.value ??
          (state.shelf?.id === "newsletter-shelf"
            ? state.shelf.itemId
            : null) ??
          (state.carousel?.id === "newsletter-carousel"
            ? state.carousel.slideId
            : null) ??
          (state.modal?.id === "newsletter-reader"
            ? state.modal.itemId
            : null);

        if (!requestedSlug) return;

        const targetNewsletter = newsletters.find(
          (n) => n.slug === requestedSlug || n.id === requestedSlug,
        );

        if (targetNewsletter) {
          setSelectedNewsletter(targetNewsletter);
        }
      },
    }),
    [newsletters],
  );

  useSearchRevealController("newsletter-shelf", searchController);
  useSearchRevealController("newsletter-carousel", searchController);
  useSearchRevealController("newsletter-reader", searchController);

  return (
    <section
      id="newsletter-page"
      className="viewport-fold relative flex scroll-mt-20 flex-col items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#002352_0%,#020b18_55%,#00040a_100%)] px-4 py-8 sm:py-14 text-white min-h-screen"
    >
      {/* Header */}
      <div className="z-10 flex max-w-4xl flex-col items-center pt-4 sm:pt-6 pb-8 sm:pb-12 text-center">
        <h1
          id="newsletter-heading"
          className="text-[clamp(2.25rem,5.5vw,5.25rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white"
        >
          Explore Our Newsletters
        </h1>
      </div>

      {/* Bookshelf Grid Layout (3 columns on desktop/laptop, 2 columns on mobile) */}
      <div className="z-10 w-full max-w-5xl px-2 sm:px-6 my-auto pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-12 items-start justify-items-center">
          {newsletters.map((newsletter) => (
            <button
              key={newsletter.id}
              type="button"
              onClick={() => setSelectedNewsletter(newsletter)}
              className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 w-full max-w-[260px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
              aria-label={`Read ${newsletter.title} (${newsletter.date})`}
            >
              {/* Cover Card with White Edge Glow & Slight Scale Expansion on Hover */}
              <div className="relative w-full aspect-[1/1.414] overflow-hidden bg-slate-900 shadow-xl ring-1 ring-white/15 transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:ring-2 group-hover:ring-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.7)]">
                <Image
                  src={newsletter.coverImage}
                  alt={`${newsletter.title} Cover`}
                  fill
                  sizes="(max-width: 768px) 45vw, 300px"
                  className="object-cover transition-all duration-300"
                  priority={newsletter.issueNumber >= 4}
                />
              </div>

              {/* Newsletter Date Display Below Cover */}
              <span className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-medium tracking-tight text-slate-200 group-hover:text-white transition-colors duration-200">
                {newsletter.date}
              </span>
            </button>
          ))}
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
