"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useSearchRevealController } from "@/global-components/search/search-navigation-provider";
import type { Drone } from "./drone-data";
import { DroneDetailsModal } from "./drone-details-modal";
import { DroneVisual } from "./drone-visual";

type DroneCarouselProps = {
  drones: Drone[];
};

// DroneCarousel presents the fleet with arrow controls and adjacent-image navigation.
export function DroneCarousel({ drones }: DroneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const [isActiveHovered, setIsActiveHovered] = useState(false);
  const carouselRef = useRef<HTMLElement | null>(null);

  const visibleDrones = useMemo(
    () => getVisibleDrones(drones, activeIndex),
    [activeIndex, drones],
  );

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
        carousel?: {
          id: string;
          slideId: string;
        };
        modal?: {
          id: string;
          itemId: string;
        };
        interactions?: Array<{
          type: string;
          groupId: string;
          value: string;
        }>;
      }) => {
        const carouselInteraction = state.interactions?.find(
          (interaction) =>
            interaction.type === "carousel" &&
            interaction.groupId === "our-drones-carousel",
        );

        const modalInteraction = state.interactions?.find(
          (interaction) =>
            interaction.type === "modal" &&
            interaction.groupId === "drone-details",
        );

        const requestedSlug =
          carouselInteraction?.value ??
          modalInteraction?.value ??
          (state.carousel?.id === "our-drones-carousel"
            ? state.carousel.slideId
            : null) ??
          (state.modal?.id === "drone-details"
            ? state.modal.itemId
            : null);

        if (!requestedSlug) {
          return;
        }

        const nextIndex = drones.findIndex(
          (drone) => drone.slug === requestedSlug,
        );
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
      className="viewport-fold relative flex scroll-mt-20 flex-col items-center justify-between overflow-hidden bg-blue-100 px-4 py-4 sm:py-8"
    >
      {/* Background cloud image */}
      <div className="absolute inset-0 z-0 select-none opacity-40">
        <Image
          src="/images/drones/clouds.webp"
          alt="Sky background with clouds"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Header */}
      <div className="z-10 flex max-w-4xl flex-col items-center pt-2 text-center text-blue-900 sm:pt-4">
        <h1 className="text-[clamp(2.5rem,6vw,5.75rem)] font-medium leading-[0.9] tracking-[-0.05em]">
          Explore Our Drones
        </h1>
      </div>

      {/* Active drone name and carousel */}
      <div className="relative z-10 my-auto flex w-full max-w-[1720px] flex-1 flex-col items-center justify-center py-2 sm:py-4">
        {/* Active drone name */}
        <button
          type="button"
          className={`-mb-2 max-w-[92vw] cursor-pointer text-balance text-[clamp(2.75rem,6vw,5.75rem)] font-medium leading-[0.9] tracking-[-0.05em] transition sm:-mb-4 ${
            isActiveHovered
              ? "text-blue-500"
              : "text-blue-900 hover:text-blue-500"
          }`}
          onClick={() => setSelectedDrone(drones[activeIndex])}
        >
          {drones[activeIndex].name}
        </button>

        {/* Carousel */}
        <div className="relative flex min-h-[340px] sm:min-h-[460px] lg:min-h-[540px] w-full items-center justify-center">
          {/* Navigation controls aligned beneath the navbar controls */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 grid w-full -translate-y-1/2 grid-cols-[84px_minmax(0,1fr)_84px] items-center px-5 sm:grid-cols-[132px_minmax(0,1fr)_132px] sm:px-8 lg:px-12">
            <button
              type="button"
              onClick={() => navigateTo(activeIndex - 1)}
              className="pointer-events-auto inline-flex h-14 w-14 cursor-pointer items-center justify-center justify-self-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-900/30 focus-visible:outline-none motion-reduce:transition-none sm:h-16 sm:w-16"
              aria-label="Show previous drone"
            >
              <LuChevronLeft className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>

            <button
              type="button"
              onClick={() => navigateTo(activeIndex + 1)}
              className="pointer-events-auto col-start-3 inline-flex h-14 w-14 cursor-pointer items-center justify-center justify-self-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-900/30 focus-visible:outline-none motion-reduce:transition-none sm:h-16 sm:w-16"
              aria-label="Show next drone"
            >
              <LuChevronRight className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>
          </div>

          {/* Drone renders */}
          <div className="relative flex min-h-[340px] sm:min-h-[460px] lg:min-h-[540px] w-full max-w-7xl items-center justify-center">
            {visibleDrones.map(({ drone, index, offset }) => {
              const isActive = offset === 0;

              return (
                <button
                  key={drone.slug}
                  type="button"
                  aria-label={
                    isActive
                      ? `Open ${drone.name} details`
                      : `Show ${drone.name}`
                  }
                  className="absolute flex cursor-pointer items-center justify-center transition-all duration-700 ease-out"
                  onMouseEnter={() => setIsActiveHovered(isActive)}
                  onMouseLeave={() => setIsActiveHovered(false)}
                  onClick={() =>
                    isActive
                      ? setSelectedDrone(drone)
                      : navigateTo(index)
                  }
                  style={getDroneSlideStyle(isActive, isActiveHovered, offset)}
                >
                  <DroneVisual drone={drone} priority={true} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drone details modal */}
      {selectedDrone ? (
        <DroneDetailsModal
          drone={selectedDrone}
          onClose={() => setSelectedDrone(null)}
        />
      ) : null}
    </section>
  );
}

// getVisibleDrones returns the active drone plus surrounding neighbours for smooth pre-loading transitions.
function getVisibleDrones(drones: Drone[], activeIndex: number) {
  return [-2, -1, 0, 1, 2].map((offset) => {
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

// getDroneSlideStyle calculates responsive layout and transform properties for active and inactive drone slides.
function getDroneSlideStyle(
  isActive: boolean,
  isActiveHovered: boolean,
  offset: number,
) {
  const isOffscreen = Math.abs(offset) > 1;

  return {
    height: isActive ? "48vh" : "20vh",
    maxHeight: isActive ? "520px" : "180px",
    maxWidth: isActive ? "920px" : "240px",
    opacity: isOffscreen ? 0 : isActive ? 1 : 0.65,
    pointerEvents: isOffscreen ? ("none" as const) : ("auto" as const),
    transform: `translateX(${offset * 195}%) translateY(${
      isActive ? -16 : -90
    }px) scale(${
      isActive
        ? isActiveHovered
          ? 1.08
          : 1
        : 0.85
    })`,
    width: isActive ? "82vw" : "22vw",
    zIndex: isActive ? 2 : 1,
  };
}

