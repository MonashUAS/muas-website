"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FilterPillNav } from "@/global-components/filter-pill-nav";
import {
  useSearchNavigation,
  useSearchRevealController,
} from "@/global-components/search/search-navigation-provider";
import { searchSlug } from "@/lib/search/content";
import {
  techSpecPanels,
  type TechSpecPanelMetric,
} from "./tech-specs-data";

const dimensionsPanelIndex = techSpecPanels.findIndex(
  (panel) => panel.navTitle.toLowerCase() === "dimensions",
);

const fallbackTechSpecImage =
  "/images/suas initiative page/technical specifications/Deployed.jpg";

const metricGradientClass =
  "bg-gradient-to-b from-red-500 to-red-200 bg-clip-text text-transparent";

const sectionHeadingClass =
  "text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white";

const metricSlotCount = 6;

const techSpecPillItems = techSpecPanels.map((panel, index) => ({
  id: String(index),
  label: panel.navTitle,
}));

function resolvePanelImageSrc(
  src: string,
  failedImageSources: string[],
): string {
  return failedImageSources.includes(src)
    ? fallbackTechSpecImage
    : src;
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

function isMappingSoftwareMetric(
  panelSlug: string,
  metric: TechSpecPanelMetric,
) {
  return (
    panelSlug === "vision" &&
    metric.label === "Mapping Software"
  );
}

// Renders the selectable Redback technical specification panels with
// fade/dissolve transitions.
export function TechSpecs() {
  const initialPanelIndex =
    dimensionsPanelIndex >= 0 ? dimensionsPanelIndex : 0;

  const [activeIndex, setActiveIndex] =
    useState(initialPanelIndex);

  const [failedImageSources, setFailedImageSources] = useState<
    string[]
  >([]);

  const preloadGeneration = useRef(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  const { registerSearchTarget } = useSearchNavigation();

  const activePanel =
    techSpecPanels[activeIndex] ?? techSpecPanels[0];

  const activePanelSlug = searchSlug(activePanel.navTitle);

  const activeImageSrc = resolvePanelImageSrc(
    activePanel.image.src,
    failedImageSources,
  );

  /*
   * Mapping Software spans both columns, so it occupies two grid slots.
   * Other metrics occupy one grid slot each.
   */
  const occupiedMetricSlotCount = activePanel.metrics.reduce(
    (total, metric) =>
      total +
      (isMappingSoftwareMetric(activePanelSlug, metric)
        ? 2
        : 1),
    0,
  );

  const emptyMetricSlotCount = Math.max(
    0,
    metricSlotCount - occupiedMetricSlotCount,
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
        preloadImage(
          resolvePanelImageSrc(
            panel.image.src,
            failedImageSources,
          ),
        ),
      ),
    ).then(() => {
      if (generation !== preloadGeneration.current) {
        return;
      }
    });
  }, [failedImageSources]);

  const changePanel = useCallback(
    (index: number) => {
      if (
        index === activeIndex ||
        !techSpecPanels[index]
      ) {
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
        interactions?: Array<{
          type: string;
          groupId: string;
          value: string;
        }>;
      }) => {
        const interaction = state.interactions?.find(
          (item) =>
            item.type === "pill" &&
            item.groupId ===
              "technical-specifications",
        );

        if (!interaction) {
          return;
        }

        const nextIndex = techSpecPanels.findIndex(
          (panel) =>
            searchSlug(panel.navTitle) ===
            interaction.value,
        );

        if (nextIndex >= 0) {
          changePanel(nextIndex);
        }
      },
    }),
    [changePanel],
  );

  useSearchRevealController(
    "technical-specifications",
    searchController,
  );

  useEffect(() => {
    const root = sectionRef.current;

    if (!root) {
      return;
    }

    const cleanups = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-search-target-id]",
      ),
    ).map((element) => {
      const id = element.dataset.searchTargetId;

      if (!id) {
        return () => undefined;
      }

      return registerSearchTarget(id, {
        element,
        highlightMode:
          element.dataset.searchHighlightMode ===
          "component"
            ? "component"
            : "text",
        isReady: () =>
          element.getClientRects().length > 0 &&
          element.closest("[aria-hidden='true']") ===
            null,
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [activePanelSlug, registerSearchTarget]);

  const handleImageError = (src: string) => {
    setFailedImageSources((sources) =>
      sources.includes(src)
        ? sources
        : [...sources, src],
    );
  };

  return (
    <section
      id="technical-specifications"
      ref={sectionRef}
      className="scroll-mt-10 bg-black-500 px-6 py-10 text-white sm:py-14 lg:px-14 lg:py-20"
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

        <div className="mt-5 grid grid-cols-1 items-stretch bg-black-500 sm:mt-6 lg:mt-8 lg:h-[34rem] lg:grid-cols-[minmax(22rem,0.86fr)_minmax(0,1fr)] lg:overflow-hidden">
          {/* Specification text and metric cards */}
          <div className="relative z-10 order-2 flex min-h-0 flex-col py-2 lg:order-1 lg:h-full lg:py-6 lg:pr-10">
            <h3
              data-search-target-id={`tech-spec-${activePanelSlug}-heading`}
              data-search-managed="true"
              data-search-highlight-mode="text"
              className="break-words text-[clamp(1.65rem,5vw,2.4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white lg:text-[clamp(2rem,3vw,3rem)]"
            >
              {activePanel.title}
            </h3>

            <div className="mt-3 min-h-[2.85rem] space-y-1 text-sm leading-tight text-white/68 sm:text-base lg:mt-4 lg:min-h-[3.25rem] lg:text-h7">
              {activePanel.kicker ? (
                <p
                  data-search-target-id={`tech-spec-${activePanelSlug}-kicker`}
                  data-search-managed="true"
                  data-search-highlight-mode="text"
                  className="break-words"
                >
                  {activePanel.kicker}
                </p>
              ) : null}

              <p
                data-search-target-id={`tech-spec-${activePanelSlug}-subtitle`}
                data-search-managed="true"
                data-search-highlight-mode="text"
                className="break-words"
              >
                {activePanel.subtitle}
              </p>
            </div>

            <div className="mt-4 grid min-h-0 grid-cols-1 auto-rows-min items-stretch gap-2 sm:grid-cols-2 sm:grid-rows-[repeat(3,minmax(6.5rem,1fr))] sm:gap-3 lg:mt-6 lg:flex-1 lg:grid-rows-3 lg:gap-3 lg:overflow-hidden">
              {activePanel.metrics.map((metric) => (
                <SpecPanelMetric
                  key={metric.label}
                  metric={metric}
                  panelSlug={activePanelSlug}
                />
              ))}

              {Array.from({
                length: emptyMetricSlotCount,
              }).map((_, index) => (
                <div
                  key={`empty-metric-${index}`}
                  aria-hidden="true"
                  className="hidden h-full border border-transparent sm:block"
                />
              ))}
            </div>
          </div>

          {/* Supporting specification image */}
          <div className="relative order-1 mb-4 h-[160px] shrink-0 overflow-hidden bg-black-500 sm:h-[210px] lg:order-2 lg:mb-0 lg:h-full">
            {techSpecPanels.map((panel, index) => {
              const panelImageSrc = resolvePanelImageSrc(
                panel.image.src,
                failedImageSources,
              );

              const isActiveImage = index === activeIndex;

              return (
                <Image
                  key={panel.navTitle}
                  src={panelImageSrc}
                  alt={isActiveImage ? activePanel.image.alt : ""}
                  aria-hidden={isActiveImage ? undefined : true}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  decoding="async"
                  loading={index === initialPanelIndex ? undefined : "eager"}
                  priority={index === initialPanelIndex}
                  unoptimized
                  className={`object-contain object-center transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                    isActiveImage ? "opacity-100" : "opacity-0"
                  }`}
                  onError={() => handleImageError(panel.image.src)}
                />
              );
            })}
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

  const isMappingSoftware = isMappingSoftwareMetric(
    panelSlug,
    metric,
  );

  return (
    <div
      className={`flex h-full min-h-[5.7rem] min-w-0 flex-col justify-between overflow-hidden border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_55px_rgba(0,0,0,0.18)] sm:min-h-0 sm:p-3 lg:p-3.5 ${
        isMappingSoftware
          ? "sm:col-span-2"
          : ""
      }`}
    >
      <p
        data-search-target-id={`tech-spec-${panelSlug}-${metricSlug}-value`}
        data-search-managed="true"
        data-search-highlight-mode="text"
        className={`inline-block max-w-full min-w-0 break-words pb-[0.06em] pr-[0.08em] font-black tracking-tight [overflow-wrap:anywhere] ${
          isMappingSoftware
            ? "text-[clamp(1rem,4vw,1.25rem)] leading-[1.08] sm:text-[clamp(1.05rem,2vw,1.32rem)] lg:text-[clamp(1.08rem,1.15vw,1.38rem)]"
            : "text-[clamp(0.86rem,3.45vw,1.1rem)] leading-[1.06] sm:text-[clamp(0.9rem,1.8vw,1.18rem)] lg:text-[clamp(0.92rem,1vw,1.28rem)]"
        } ${metricGradientClass}`}
      >
        {metric.value}
      </p>

      <p
        data-search-target-id={`tech-spec-${panelSlug}-${metricSlug}-label`}
        data-search-managed="true"
        data-search-highlight-mode="text"
        className="mt-1.5 min-w-0 break-words text-[0.68rem] leading-[1.12] text-white/68 [overflow-wrap:anywhere] sm:mt-2 sm:text-xs lg:text-[0.82rem]"
      >
        {metric.label}
      </p>
    </div>
  );
}
