"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FilterPillNav } from "@/global-components/filter-pill-nav";
import {
  useSearchNavigation,
  useSearchRevealController,
} from "@/global-components/search/search-navigation-provider";
import { searchSlug } from "@/lib/search/content";
import { techSpecPanels } from "./tech-specs-data";
import type { TechSpecPanelMetric } from "./tech-specs-data";

const deployedPanelIndex = techSpecPanels.findIndex(
  (panel) => panel.navTitle.toLowerCase() === "deployed",
);

const fallbackTechSpecImage =
  "/images/suas initiative page/technical specifications/Deployed.jpg";

const metricGradientClass =
  "bg-gradient-to-b from-red-500 to-red-200 bg-clip-text text-transparent";

const sectionHeadingClass =
  "text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white";

const metricSlotCount = 5;
const techSpecPillItems = techSpecPanels.map((panel, index) => ({
  id: String(index),
  label: panel.navTitle,
}));

function resolvePanelImageSrc(
  src: string,
  failedImageSources: string[],
): string {
  return failedImageSources.includes(src) ? fallbackTechSpecImage : src;
}

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;

    if (image.complete) {
      resolve();
    }
  });
}

// Renders the selectable Redback technical specification panels with
// fade/dissolve transitions.
export function TechSpecs() {
  const initialPanelIndex =
    deployedPanelIndex >= 0 ? deployedPanelIndex : 0;

  const [activeIndex, setActiveIndex] = useState(initialPanelIndex);
  const [failedImageSources, setFailedImageSources] = useState<string[]>(
    [],
  );

  const preloadGeneration = useRef(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const { registerSearchTarget } = useSearchNavigation();

  const activePanel = techSpecPanels[activeIndex];
  const activePanelSlug = searchSlug(activePanel.navTitle);
  const activeImageSrc = resolvePanelImageSrc(
    activePanel.image.src,
    failedImageSources,
  );
  const emptyMetricSlotCount = Math.max(
    0,
    metricSlotCount - activePanel.metrics.length,
  );

  useEffect(() => {
    return () => {
      preloadGeneration.current += 1;
    };
  }, []);

  useEffect(() => {
    const generation = ++preloadGeneration.current;

    void Promise.all(
      techSpecPanels.map((panel) =>
        preloadImage(resolvePanelImageSrc(panel.image.src, failedImageSources)),
      ),
    ).then(() => {
      if (generation !== preloadGeneration.current) {
        return;
      }
    });
  }, [failedImageSources]);

  const changePanel = useCallback(
    (index: number) => {
      if (index === activeIndex || !techSpecPanels[index]) {
        return;
      }

      preloadGeneration.current += 1;
      setActiveIndex(index);
    },
    [activeIndex],
  );

  const searchController = useMemo(
    () => ({
      reveal: (state: {
        interactions?: Array<{ type: string; groupId: string; value: string }>;
      }) => {
        const interaction = state.interactions?.find(
          (item) =>
            item.type === "pill" &&
            item.groupId === "technical-specifications",
        );

        if (!interaction) {
          return;
        }

        const nextIndex = techSpecPanels.findIndex(
          (panel) => searchSlug(panel.navTitle) === interaction.value,
        );

        if (nextIndex >= 0) {
          changePanel(nextIndex);
        }
      },
    }),
    [changePanel],
  );

  useSearchRevealController("technical-specifications", searchController);

  useEffect(() => {
    const root = sectionRef.current;

    if (!root) {
      return;
    }

    const cleanups = Array.from(
      root.querySelectorAll<HTMLElement>("[data-search-target-id]"),
    ).map((element) => {
      const id = element.dataset.searchTargetId;

      if (!id) {
        return () => undefined;
      }

      return registerSearchTarget(id, {
        element,
        highlightMode:
          element.dataset.searchHighlightMode === "component"
            ? "component"
            : "text",
        isReady: () =>
          element.getClientRects().length > 0 &&
          element.closest("[aria-hidden='true']") === null,
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [activePanelSlug, registerSearchTarget]);

  const handleImageError = () => {
    setFailedImageSources((sources) =>
      sources.includes(activePanel.image.src)
        ? sources
        : [...sources, activePanel.image.src],
    );
  };

  return (
    <section
      id="technical-specifications"
      ref={sectionRef}
      className="scroll-mt-10 bg-black-500 px-6 pb-4 pt-10 text-white sm:pb-8 sm:pt-12 lg:px-14 lg:pb-10 lg:pt-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2
          data-search-target-id="technical-specifications-heading"
          data-search-managed="true"
          data-search-highlight-mode="text"
          className={`mb-5 text-center sm:mb-6 lg:mb-8 ${sectionHeadingClass}`}
        >
          Technical Specifications
        </h2>

        <FilterPillNav
          ariaLabel="Explore technical specifications"
          items={techSpecPillItems}
          activeId={String(activeIndex)}
          onSelect={(id) => changePanel(Number(id))}
          getSearchTargetId={(item) =>
            `tech-spec-${searchSlug(item.label)}-nav`
          }
        />

        <div
          className="mt-5 grid grid-cols-1 items-stretch bg-black-500 sm:mt-6 lg:mt-8 lg:h-[34rem] lg:grid-cols-[minmax(22rem,0.86fr)_minmax(0,1fr)] lg:overflow-hidden"
        >
          <div className="relative z-10 order-2 flex min-h-0 flex-col py-2 lg:order-1 lg:h-full lg:py-6 lg:pr-10">
            <h3
              data-search-target-id={`tech-spec-${activePanelSlug}-heading`}
              data-search-managed="true"
              data-search-highlight-mode="text"
              className="text-[clamp(1.65rem,5vw,2.4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white lg:text-[clamp(2rem,3vw,3rem)]"
            >
              {activePanel.title}
            </h3>

            <div className="mt-3 min-h-[2.85rem] space-y-1 text-sm leading-tight text-white/68 sm:text-base lg:mt-4 lg:min-h-[3.25rem] lg:text-h7">
              {activePanel.kicker ? (
                <p
                  data-search-target-id={`tech-spec-${activePanelSlug}-kicker`}
                  data-search-managed="true"
                  data-search-highlight-mode="text"
                >
                  {activePanel.kicker}
                </p>
              ) : null}

              <p
                data-search-target-id={`tech-spec-${activePanelSlug}-subtitle`}
                data-search-managed="true"
                data-search-highlight-mode="text"
              >
                {activePanel.subtitle}
              </p>
            </div>

            {/*
              Tablet and desktop reserve the same metric positions.

              Mobile:
              - One column
              - Natural height after the visible metric cards

              Tablet and desktop:
              - Two columns
              - Three equal rows

              Panels with fewer metrics leave unused grid positions empty rather
              than stretching their cards to fill the remaining space.
            */}
            <div className="mt-4 grid min-h-0 grid-cols-1 auto-rows-[6rem] items-stretch gap-2 sm:grid-cols-2 sm:grid-rows-[repeat(3,6.25rem)] sm:gap-3 lg:mt-6 lg:flex-1 lg:grid-rows-3 lg:gap-3 lg:overflow-hidden">
              {activePanel.metrics.map((metric) => (
                <SpecPanelMetric
                  key={metric.label}
                  metric={metric}
                  panelSlug={activePanelSlug}
                />
              ))}
              {Array.from({ length: emptyMetricSlotCount }).map((_, index) => (
                <div
                  key={`empty-metric-${index}`}
                  aria-hidden="true"
                  className="hidden h-full border border-transparent sm:block"
                />
              ))}
            </div>
          </div>

          <div className="relative order-1 mb-4 h-[160px] shrink-0 overflow-hidden bg-black-500 sm:h-[210px] lg:order-2 lg:mb-0 lg:h-full">
            <Image
              key={activeImageSrc}
              src={activeImageSrc}
              alt={activePanel.image.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              decoding="async"
              className="object-contain object-center"
              onError={handleImageError}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecPanelMetric({
  metric,
  panelSlug,
}: {
  metric: TechSpecPanelMetric;
  panelSlug: string;
}) {
  const metricSlug = searchSlug(metric.label);

  return (
    <div className="flex h-full min-h-0 flex-col justify-between border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.18)] sm:p-3.5 lg:p-4">
      <p
        data-search-target-id={`tech-spec-${panelSlug}-${metricSlug}-value`}
        data-search-managed="true"
        data-search-highlight-mode="text"
        className={`inline-block max-w-full break-words pb-[0.06em] pr-[0.08em] text-[clamp(0.88rem,3.5vw,1.12rem)] font-black leading-[1.02] tracking-tight sm:text-[clamp(0.95rem,2.15vw,1.28rem)] lg:text-[clamp(0.98rem,1.18vw,1.42rem)] ${metricGradientClass}`}
      >
        {metric.value}
      </p>

      <p
        data-search-target-id={`tech-spec-${panelSlug}-${metricSlug}-label`}
        data-search-managed="true"
        data-search-highlight-mode="text"
        className="mt-1.5 text-[0.68rem] leading-[1.08] text-white/68 sm:mt-2 sm:text-xs lg:text-sm"
      >
        {metric.label}
      </p>
    </div>
  );
}
