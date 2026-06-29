"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Drone } from "./drone-data";
import { DroneDetailsModal } from "./DroneDetailsModal";
import { DroneVisual } from "./DroneVisual";

type DroneCarouselProps = {
  drones: Drone[];
};

// DroneCarousel presents the fleet with wheel and adjacent-image navigation.
export function DroneCarousel({ drones }: DroneCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(6);
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);
  const lastWheelAt = useRef(0);
  const visibleDrones = useMemo(() => getVisibleDrones(drones, activeIndex), [activeIndex, drones]);

  // navigateTo moves the active drone to the requested index.
  const navigateTo = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, drones.length));
    },
    [drones.length],
  );

  // handleWheel converts a scroll gesture into carousel navigation.
  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      const now = Date.now();

      if (Math.abs(event.deltaY) < 10 || now - lastWheelAt.current < 520) {
        return;
      }

      event.preventDefault();
      lastWheelAt.current = now;
      navigateTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
    },
    [activeIndex, navigateTo],
  );

  return (
    <section
      className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-gradient-to-b from-blue-100 via-blue-50 to-white px-4 py-12"
      onWheel={handleWheel}
    >
      <div className="absolute top-8 text-center uppercase text-blue-900">
        <p className="text-caption font-black leading-none">Explore</p>
        <h1 className="mt-1 text-h7 font-black leading-none sm:text-h6">Our Drones</h1>
      </div>

      <div className="relative flex h-[68vh] min-h-[430px] w-full max-w-6xl items-center justify-center">
        {visibleDrones.map(({ drone, index, offset }) => {
          const isActive = offset === 0;

          return (
            <button
              aria-label={isActive ? `Open ${drone.name} details` : `Show ${drone.name}`}
              className="absolute flex items-center justify-center transition-all duration-700 ease-out"
              key={drone.slug}
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

      <button
        className="absolute bottom-14 max-w-[92vw] text-h4 font-black uppercase leading-none text-blue-900 transition hover:text-blue-500 sm:text-h2"
        onClick={() => setSelectedDrone(drones[activeIndex])}
        type="button"
      >
        {drones[activeIndex].name}.
      </button>

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
