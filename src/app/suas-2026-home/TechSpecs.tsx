"use client";

import Image from "next/image";
import { useState } from "react";

import { techSpecPanels } from "./tech-specs-data";
import type { TechSpecPanelMetric } from "./tech-specs-data";

const deployedPanelIndex = techSpecPanels.findIndex(
  (panel) => panel.navTitle === "deployed",
);

// TechSpecs renders Redback metrics as selectable technical panels.
export function TechSpecs() {
  const [activeIndex, setActiveIndex] = useState(
    deployedPanelIndex >= 0 ? deployedPanelIndex : 0,
  );
  const activePanel = techSpecPanels[activeIndex];

  return (
    <section
      id="technical-specifications"
      className="scroll-mt-10 bg-black-500 px-6 py-20 text-white lg:px-14"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-center text-[clamp(1.5rem,3vw,3rem)] font-medium leading-none tracking-tighter text-white">
          Technical Specifications
        </h2>

        <nav
          aria-label="Explore technical specifications"
          className="mt-8 flex max-w-full justify-start gap-3 overflow-x-auto pb-2 text-b2 font-medium text-red-50 sm:text-b1 lg:justify-center"
        >
          {techSpecPanels.map((panel, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={panel.navTitle}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 rounded-full border px-4 py-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none ${
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

        <div className="mt-12 grid min-h-[34rem] overflow-hidden bg-black-500 lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1fr)] lg:items-stretch">
          <div className="relative z-10 flex flex-col justify-center pb-10 lg:py-8 lg:pr-10">
            <h3 className="font-medium leading-tight tracking-tighter text-white text-h5 sm:text-h4">
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
              src={activePanel.image.src}
              alt={activePanel.image.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-contain object-center lg:object-right"
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
      <p className="max-w-xl break-words text-h5 font-black leading-tight tracking-tight text-red-500 sm:text-h4">
        <span>{metric.value}</span>
        {metric.metricValue ? (
          <span className="text-violet-400"> {`(${metric.metricValue})`}</span>
        ) : null}
      </p>
      <p className="mt-4 space-y-1 leading-tight text-white/68 text-subtitle">
        {metric.label}
      </p>
    </div>
  );
}
