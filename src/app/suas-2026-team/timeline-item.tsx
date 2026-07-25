"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useSearchNavigation } from "@/global-components/search/search-navigation-provider";
import type { TimelineItemContent } from "./timeline-data";
import { TimelineRevealItem } from "./timeline-reveal";

type TimelineItemProps = {
  item: TimelineItemContent;
  align: "left" | "right";
  index: number;
};

function forceTimelineReveal(element: HTMLElement) {
  const revealRoot = element.closest<HTMLElement>("[data-suas-reveal]");
  revealRoot?.classList.add("is-visible");
}

export function TimelineItem({ item, align, index }: TimelineItemProps) {
  const isLeft = align === "left";
  const textOrderClass = isLeft
    ? "md:order-1 md:text-right"
    : "md:order-2 md:text-left";
  const imageOrderClass = isLeft ? "md:order-2" : "md:order-1";
  const articleRef = useRef<HTMLElement | null>(null);
  const { registerSearchTarget } = useSearchNavigation();

  const dateId = `timeline-${item.slug}-date`;
  const titleId = `timeline-${item.slug}-title`;
  const bodyId = `timeline-${item.slug}-body`;
  const itemId = `timeline-${item.slug}`;

  useEffect(() => {
    const root = articleRef.current;

    if (!root) {
      return;
    }

    const cleanups = Array.from(
      root.querySelectorAll<HTMLElement>("[data-search-target-id]"),
    ).flatMap((element) => {
      const targetId = element.dataset.searchTargetId;

      if (!targetId) {
        return [];
      }

      return [
        registerSearchTarget(targetId, {
          element,
          highlightMode:
            element.dataset.searchHighlightMode === "text"
              ? "text"
              : "component",
          isReady: () => {
            forceTimelineReveal(element);
            return (
              element.getClientRects().length > 0 &&
              element.closest("[aria-hidden='true']") === null
            );
          },
        }),
      ];
    });

    // Also register the item container itself for scroll targets.
    cleanups.push(
      registerSearchTarget(itemId, {
        element: root,
        highlightMode: "component",
        isReady: () => {
          forceTimelineReveal(root);
          return root.getClientRects().length > 0;
        },
      }),
    );

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [bodyId, dateId, itemId, registerSearchTarget, titleId]);

  return (
    <TimelineRevealItem
      ref={articleRef}
      id={itemId}
      index={index}
      className="relative isolate grid items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-16"
    >
      <div className={`${textOrderClass} relative z-10 min-w-0`}>
        <div className={`max-w-2xl ${isLeft ? "md:ml-auto" : ""}`}>
          <p
            data-search-target-id={dateId}
            data-search-managed="true"
            data-search-highlight-mode="text"
            className="text-subtitle leading-tight text-blue-50/82"
          >
            {item.date}
          </p>
          <h3
            data-search-target-id={titleId}
            data-search-managed="true"
            data-search-highlight-mode="text"
            className="mt-2 text-h6 font-black leading-tight tracking-[-0.05em] text-white sm:text-h5"
          >
            {item.title}
          </h3>
          <p
            data-search-target-id={bodyId}
            data-search-managed="true"
            data-search-highlight-mode="text"
            className="mt-4 text-b1 leading-relaxed text-blue-50/84 sm:mt-5 sm:text-subtitle sm:leading-relaxed"
          >
            {item.body}
          </p>
        </div>
      </div>

      <div className={`${imageOrderClass} relative z-10 min-w-0`}>
        <div className="relative h-[240px] w-full overflow-hidden border border-blue-100/20 bg-blue-900 shadow-[0_34px_110px_rgba(0,0,0,0.46)] sm:h-[360px] lg:h-[430px]">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(min-width: 1024px) 42vw, (min-width: 768px) 44vw, calc(100vw - 40px)"
            className="object-cover"
            style={{ objectPosition: item.objectPosition ?? "50% 50%" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.28)_0%,rgba(0,31,73,0.05)_48%,rgba(0,0,0,0.18)_100%),linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,31,73,0.3)_100%)]" />
          <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />
          <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
        </div>
      </div>
    </TimelineRevealItem>
  );
}
