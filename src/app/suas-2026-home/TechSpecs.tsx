"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { techSpecPanels } from "./tech-specs-data";
import type { TechSpecPanelMetric } from "./tech-specs-data";

const deployedPanelIndex = techSpecPanels.findIndex(
  (panel) => panel.navTitle === "deployed",
);

const fallbackTechSpecImage = "/images/redback-tech-specs/deployed.png";

const metricGradientClass =
  "bg-gradient-to-b from-red-500 to-red-200 bg-clip-text text-transparent";

const sectionHeadingClass =
  "text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white";

// Renders the selectable Redback technical specification panels with
// fade/dissolve transitions.
export function TechSpecs() {
  const initialPanelIndex =
    deployedPanelIndex >= 0 ? deployedPanelIndex : 0;

  const [activeIndex, setActiveIndex] = useState(initialPanelIndex);
  const [displayedIndex, setDisplayedIndex] =
    useState(initialPanelIndex);
  const [isDissolving, setIsDissolving] = useState(false);
  const [failedImageSources, setFailedImageSources] = useState<string[]>(
    [],
  );

  const transitionTimer = useRef<number | null>(null);

  const activePanel = techSpecPanels[displayedIndex];

  const imageSrc = failedImageSources.includes(activePanel.image.src)
    ? fallbackTechSpecImage
    : activePanel.image.src;

  // Clear the transition timer if the component unmounts.
  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  const changePanel = (index: number) => {
    if (index === activeIndex) {
      return;
    }

    setActiveIndex(index);
    setIsDissolving(true);

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }

    transitionTimer.current = window.setTimeout(() => {
      setDisplayedIndex(index);

      window.requestAnimationFrame(() => {
        setIsDissolving(false);
      });
    }, 180);
  };

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
      className="scroll-mt-10 bg-black-500 px-6 pb-8 pt-12 text-white sm:pb-10 sm:pt-14 lg:px-14 lg:pb-10 lg:pt-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2 className={`mb-8 text-center ${sectionHeadingClass}`}>
          Technical Specifications
        </h2>

        <nav
          aria-label="Explore technical specifications"
          className="mx-auto flex w-full max-w-max gap-2 overflow-x-auto px-1 py-1 sm:gap-3"
        >
          {techSpecPanels.map((panel, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={panel.navTitle}
                type="button"
                onClick={() => changePanel(index)}
                aria-current={isActive ? "true" : undefined}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-300 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none sm:text-base md:px-4 md:py-2 md:text-lg ${
                  isActive
                    ? "border-white bg-white text-black-500"
                    : "border-white/20 bg-white/[0.05] text-white/75 backdrop-blur-md hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {panel.navTitle}
              </button>
            );
          })}
        </nav>

        <div
          className={`mt-8 grid h-[760px] grid-cols-1 items-stretch overflow-hidden bg-black-500 transition-all duration-200 ease-out motion-reduce:transition-none sm:h-[640px] lg:h-[34rem] lg:grid-cols-[minmax(22rem,0.86fr)_minmax(0,1fr)] ${
            isDissolving
              ? "translate-y-1 opacity-0 blur-[3px]"
              : "translate-y-0 opacity-100 blur-0"
          }`}
        >
          <div className="relative z-10 order-2 flex h-full min-h-0 flex-col py-2 lg:order-1 lg:py-6 lg:pr-10">
            <h3 className="text-[clamp(1.65rem,5vw,2.4rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white lg:text-[clamp(2rem,3vw,3rem)]">
              {activePanel.title}
            </h3>

            <div className="mt-3 min-h-[2.85rem] space-y-1 text-sm leading-tight text-white/68 sm:text-base lg:mt-4 lg:min-h-[3.25rem] lg:text-h7">
              {activePanel.kicker ? (
                <p>{activePanel.kicker}</p>
              ) : null}

              <p>{activePanel.subtitle}</p>
            </div>

            {/*
              Every panel always reserves the same five metric positions.

              Mobile:
              - One column
              - Five equal rows

              Tablet and desktop:
              - Two columns
              - Three equal rows

              Panels with fewer metrics leave unused grid positions empty rather
              than stretching their cards to fill the remaining space.
            */}
            <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 grid-rows-5 items-stretch gap-2 overflow-hidden sm:grid-cols-2 sm:grid-rows-3 sm:gap-3 lg:mt-6 lg:gap-3">
              {activePanel.metrics.map((metric) => (
                <SpecPanelMetric
                  key={metric.label}
                  metric={metric}
                />
              ))}
            </div>
          </div>

          <div className="relative order-1 mb-5 h-[180px] shrink-0 overflow-hidden bg-black-500 sm:h-[220px] lg:order-2 lg:mb-0 lg:h-full">
            <Image
              key={activePanel.image.src}
              src={imageSrc}
              alt={activePanel.image.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
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
}: {
  metric: TechSpecPanelMetric;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col justify-between overflow-hidden border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.18)] sm:p-3.5 lg:p-4">
      <p
        className={`inline-block max-w-full break-words pb-[0.06em] pr-[0.08em] text-[clamp(0.98rem,4vw,1.28rem)] font-black leading-[1.02] tracking-tight sm:text-[clamp(1rem,2.25vw,1.36rem)] lg:text-[clamp(0.98rem,1.18vw,1.42rem)] ${metricGradientClass}`}
      >
        {metric.value}
      </p>

      <p className="mt-2 text-[0.72rem] leading-[1.12] text-white/68 sm:text-xs lg:text-sm">
        {metric.label}
      </p>
    </div>
  );
}