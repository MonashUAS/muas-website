"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchRevealController } from "@/global-components/search/search-navigation-provider";
import type { Drone } from "./drone-data";
import { DroneDetailsModal } from "./drone-details-modal";
import { DroneVisual } from "./drone-visual";
import Image from "next/image";

type DroneCarouselProps = {
  drones: Drone[];
};

// DroneCarousel presents the fleet with arrow toggle buttons and adjacent-image navigation.
export function DroneCarousel({ drones }: DroneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(6);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [isActiveHovered, setIsActiveHovered] = useState(false);
  const carouselRef = useRef<HTMLElement | null>(null);
  const visibleDrones = useMemo(() => getVisibleDrones(drones, activeIndex), [activeIndex, drones]);

  // navigateTo moves the active drone to the requested index.
  const navigateTo = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, drones.length));
    },
    [drones.length],
  );

  const searchController = useMemo(
    () => ({
      reveal: (state: {
        carousel?: { id: string; slideId: string };
        modal?: { id: string; itemId: string };
        interactions?: Array<{ type: string; groupId: string; value: string }>;
      }) => {
        const carouselInteraction = state.interactions?.find(
          (interaction) =>
            interaction.type === "carousel" &&
            interaction.groupId === "our-drones-carousel",
        );
        const modalInteraction = state.interactions?.find(
          (interaction) =>
            interaction.type === "modal" && interaction.groupId === "drone-details",
        );
        const requestedSlug =
          carouselInteraction?.value ??
          modalInteraction?.value ??
          (state.carousel?.id === "our-drones-carousel"
            ? state.carousel.slideId
            : null) ??
          (state.modal?.id === "drone-details" ? state.modal.itemId : null);

        if (!requestedSlug) {
          return;
        }

        const nextIndex = drones.findIndex((drone) => drone.slug === requestedSlug);
        const nextDrone = drones[nextIndex];

        if (!nextDrone) {
          return;
        }

        setActiveIndex(nextIndex);

        if (modalInteraction || state.modal?.id === "drone-details") {
          setSelectedDrone(nextDrone);
        }
      },
    }),
    [drones],
  );

  useSearchRevealController("our-drones-carousel", searchController);
  useSearchRevealController("drone-details", searchController);

  return (
    <section
      id="our-drones-page"
      ref={carouselRef}
      className="relative flex viewport-fold scroll-mt-20 flex-col items-center justify-between overflow-hidden bg-blue-100 px-4 py-6 sm:py-8"
    >
      {/* Background Cloud Image */}
      <div className="absolute inset-0 z-0 opacity-40 select-none">
        <Image
          src="/images/drones/clouds.jpg" 
          alt="Sky background with clouds"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* header */}
      <div className="z-10 flex flex-col items-center text-center text-blue-900 pt-2 sm:pt-4">
        <p className="text-b1 sm:text-h7 font-black uppercase tracking-wider leading-none">Explore</p>
        <h1 className="mt-1 text-h5 sm:text-h3 font-black leading-none tracking-[-0.05em]">Our Drones</h1>
      </div>

      {/* active drone name button & carousel container */}
      <div className="z-10 flex flex-1 flex-col items-center justify-center w-full max-w-6xl my-auto relative">
        {/* Arrow Navigation Toggle Buttons (bounded at max-w-[960px] to align with start of adjacent drones) */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 mx-auto flex w-full max-w-[960px] -translate-y-1/2 items-center justify-between px-2 sm:px-4">
          <button
            type="button"
            onClick={() => navigateTo(activeIndex - 1)}
            className="pointer-events-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/30 motion-reduce:transition-none sm:h-12 sm:w-12"
            aria-label="Show previous drone"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => navigateTo(activeIndex + 1)}
            className="pointer-events-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-2xl text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/30 motion-reduce:transition-none sm:h-12 sm:w-12"
            aria-label="Show next drone"
          >
            ›
          </button>
        </div>

        {/* active drone name - button */}
        <button
          className={`mb-1 sm:mb-2 max-w-[92vw] cursor-pointer text-balance text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.065em] transition ${
            isActiveHovered ? "text-blue-500" : "text-blue-900 hover:text-blue-500"
          }`}
          onClick={() => setSelectedDrone(drones[activeIndex])}
          type="button"
        >
          {drones[activeIndex].name}
        </button>

        {/* carousel */}
        <div className="relative flex min-h-[380px] w-full items-center justify-center">
        {visibleDrones.map(({ drone, index, offset }) => {
          const isActive = offset === 0;

          return (
            /* drone image - button */
            <button
              aria-label={isActive ? `Open ${drone.name} details` : `Show ${drone.name}`}
              className="absolute flex cursor-pointer items-center justify-center transition-all duration-700 ease-out"
              key={drone.slug}
              onMouseEnter={() => setIsActiveHovered(isActive)}
              onMouseLeave={() => setIsActiveHovered(false)}
              onClick={() => (isActive ? setSelectedDrone(drone) : navigateTo(index))}
              style={{
                height: isActive ? "46vh" : "22vh",
                maxHeight: isActive ? "390px" : "180px",
                maxWidth: isActive ? "720px" : "240px",
                opacity: isActive ? 1 : 0.7,
                transform: `translateX(${offset * 205}%) translateY(${isActive ? 10 : -78}px) scale(${isActive ? (isActiveHovered ? 1.1 : 1) : 0.88})`,
                width: isActive ? "64vw" : "22vw",
                zIndex: isActive ? 2 : 1,
              }}
              type="button"
            >
              <DroneVisual drone={drone} />
            </button>
          );
        })}
        </div>
      </div>
      
      {/* if a drone is selected, show the details modal */}
      {selectedDrone ? (
        <DroneDetailsModal drone={selectedDrone} onClose={() => setSelectedDrone(null)} />
      ) : null}
    </section>
  );
}

// getVisibleDrones returns the active drone plus its immediate neighbours.
function getVisibleDrones(drones: Drone[], activeIndex: number) {
  return [-1, 0, 1].map((offset) => {
    const index = wrapIndex(activeIndex + offset, drones.length);

    return {
      drone: drones[index],
      index,
      offset,
    };
  });
}

// wrapIndex loops carousel indices around the fleet list.
function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}
