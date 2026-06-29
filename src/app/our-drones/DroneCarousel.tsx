"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Drone } from "./drone-data";
import { DroneDetailsModal } from "./DroneDetailsModal";
import { DroneVisual } from "./DroneVisual";
import { useWheelNavigation } from "./useWheelNavigation";

type DroneCarouselProps = {
  drones: Drone[];
};

// DroneCarousel presents the fleet with wheel and adjacent-image navigation.
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

  // stepCarousel moves the carousel in response to captured wheel direction.
  const stepCarousel = useCallback(
    (direction: number) => {
      navigateTo(activeIndex + direction);
    },
    [activeIndex, navigateTo],
  );

  useWheelNavigation(carouselRef, {
    cooldownMs: 520,
    enabled: selectedDrone === null,
    onStep: stepCarousel,
    threshold: 10,
  });

  return (
    <section
      ref={carouselRef}
      className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-gradient-to-b from-blue-100 via-blue-50 to-white px-4 py-12"
    >
      {/* header */}
      <div className="absolute top-8 text-center uppercase text-blue-900">
        <p className="text-caption font-black leading-none">Explore</p>
        <h1 className="mt-1 text-h7 font-black leading-none sm:text-h6">Our Drones</h1>
      </div>

    {/* carousel */}
      <div className="relative flex h-[68vh] min-h-[430px] w-full max-w-6xl items-center justify-center">
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
                opacity: isActive ? 1 : 0.92,
                transform: `translateX(${offset * 205}%) translateY(${isActive ? 10 : -78}px) scale(${isActive ? 1 : 0.88})`,
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

      {/* active drone name - button */}
      <button
        className={`absolute bottom-14 max-w-[92vw] cursor-pointer text-h4 font-black uppercase leading-none transition sm:text-h2 ${
          isActiveHovered ? "text-blue-500" : "text-blue-900 hover:text-blue-500"
        }`}
        onClick={() => setSelectedDrone(drones[activeIndex])}
        type="button"
      >
        {drones[activeIndex].name}.
      </button>
      
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
