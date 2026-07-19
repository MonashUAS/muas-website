"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { techSpecPanels } from "./tech-specs-data";
import type { TechSpecPanelMetric } from "./tech-specs-data";

const deployedPanelIndex = techSpecPanels.findIndex(
  (panel) => panel.navTitle === "deployed",
);
const fallbackTechSpecImage = "/images/redback-tech-specs/deployed.png";

const metricGradientClass =
  "bg-gradient-to-b from-red-500 to-red-200 bg-clip-text text-transparent";

// Renders the selectable Redback technical specification panels with fade/dissolve transitions.
export function TechSpecs() {
  const [activeIndex, setActiveIndex] = useState(
    deployedPanelIndex >= 0 ? deployedPanelIndex : 0,
  );
  const [displayedIndex, setDisplayedIndex] = useState(
    deployedPanelIndex >= 0 ? deployedPanelIndex : 0,
  );
  const [isDissolving, setIsDissolving] = useState(false);
  const transitionTimer = useRef<number | null>(null);

  const activePanel = techSpecPanels[displayedIndex];
  const [failedImageSources, setFailedImageSources] = useState<string[]>([]);
  const imageSrc = failedImageSources.includes(activePanel.image.src)
    ? fallbackTechSpecImage
    : activePanel.image.src;

  // Clear any active timer instances if the user navigates away from the page
  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  // Triggers the out-and-in transition animations cleanly when a nav option is selected
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
    }, 180); // Matches the 180ms dissolve delay used in ManagementTeam
  };

  return (
    <section
      id="technical-specifications"
      className="scroll-mt-10 bg-black-500 px-6 py-20 text-white lg:px-14"
    >
      <div className="mx-auto w-full max-w-7xl pt-10">
        <h2 className="text-center text-[clamp(1.5rem,3vw,3rem)] font-medium leading-none tracking-tighter text-white">
          Technical Specifications
        </h2>

        <nav
          aria-label="Explore technical specifications"
          className="mx-auto mt-8 flex max-w-max gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-md sm:gap-3"
        >
          {techSpecPanels.map((panel, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={panel.navTitle}
                type="button"
                onClick={() => changePanel(index)}
                className={`shrink-0 rounded-full border px-4 py-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none hover:cursor-pointer ${
                  isActive
                    ? "border-white bg-white text-black-500"
                    : "border-white/20 bg-white/[0.05] text-white/75 backdrop-blur-md hover:bg-white/[0.1] hover:text-white"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {panel.navTitle}
              </button>
            );
          })}
        </nav>

        {/* Transition structural container wrapper */}
        <div
          className={`mt-12 grid min-h-[34rem] overflow-hidden bg-black-500 lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1fr)] lg:items-stretch transition-all duration-200 ease-out motion-reduce:transition-none ${
            isDissolving
              ? "translate-y-1 opacity-0 blur-[3px]"
              : "translate-y-0 opacity-100 blur-0"
          }`}
        >
          <div className="relative z-10 flex flex-col justify-center pb-10 lg:py-8 lg:pr-10">
            <h3 className="font-medium leading-tight tracking-tighter text-white text-[clamp(1.5rem,3vw,3rem)]">
              {activePanel.title}
            </h3>

            <div className="mt-4 space-y-1 leading-tight text-white/68 text-h7">
              {activePanel.kicker ? <p>{activePanel.kicker}</p> : null}
              <p>{activePanel.subtitle}</p>
            </div>

            <div className="mt-10 space-y-9">
              {activePanel.metrics.map((metric) => (
                <SpecPanelMetric key={metric.label} metric={metric} />
              ))}
            </div>
          </div>

          <div className="relative min-h-[18rem] overflow-hidden lg:min-h-[34rem]">
            <Image
              key={activePanel.image.src}
              src={imageSrc}
              alt={activePanel.image.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-contain object-center lg:object-right"
              onError={() =>
                setFailedImageSources((sources) =>
                  sources.includes(activePanel.image.src)
                    ? sources
                    : [...sources, activePanel.image.src],
                )
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecPanelMetric({ metric }: { metric: TechSpecPanelMetric }) {
  return (
    <div>
      <p
        className={`inline-block max-w-xl break-words pb-[0.06em] pr-[0.08em] text-h5 font-black leading-[1.08] tracking-tight sm:text-h4 ${metricGradientClass}`}
      >
        {metric.value}
      </p>
      <p className="mt-4 space-y-1 leading-tight text-white/68 text-subtitle">
        {metric.label}
      </p>
    </div>
  );
}