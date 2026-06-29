"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Drone } from "./drone-data";
import { DroneImageCarousel } from "./DroneImageCarousel";
import { DroneVisual } from "./DroneVisual";
import { SpecList } from "./SpecList";

type DroneDetailsModalProps = {
  drone: Drone;
  onClose: () => void;
};

// DroneDetailsModal shows the selected drone profile in the shared popup layout.
export function DroneDetailsModal({ drone, onClose }: DroneDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Locks the page behind the modal and starts the reveal animation.
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // requestClose plays the exit animation before removing the modal.
  const requestClose = () => {
    setIsClosing(true);
    window.setTimeout(onClose, 460);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-blue-100 via-blue-50 to-white px-4 py-8 backdrop-blur-sm transition-opacity duration-500 sm:px-8 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* modal content */}
      <article
        className="relative mx-auto min-h-[calc(100vh-4rem)] max-w-6xl border-2 border-blue-500 bg-white px-6 py-14 text-center shadow-2xl transition-[clip-path,transform] duration-500 ease-out sm:px-12 lg:px-24"
        style={{
          clipPath: isOpen && !isClosing ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transform: isOpen && !isClosing ? "translateY(0)" : "translateY(-18px)",
        }}
      >
        <button
          aria-label="Close drone details"
          className="absolute right-6 top-6 cursor-pointer text-blue-700 transition hover:scale-110 hover:text-blue-900"
          onClick={requestClose}
          type="button"
        >
          <X aria-hidden size={34} strokeWidth={3} />
        </button>

        <h2 className="text-h5 font-black uppercase leading-none text-blue-900 sm:text-h4 ">
          {drone.name}.
        </h2>

        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-b2 font-bold text-black-500 sm:text-b1">
          {drone.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mx-auto mt-8 h-64 w-full max-w-2xl sm:h-80">
          <DroneVisual drone={drone} />
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-10 sm:grid-cols-2">
          <SpecList specs={drone.features} title="Key Features" />
          <SpecList specs={drone.dimensions} title="Dimensions" />
        </div>

        {drone.gallery ? <DroneImageCarousel drone={drone} images={drone.gallery} /> : null}

        <button
          className="mt-14 cursor-pointer text-b1 font-medium uppercase text-blue-900 transition hover:text-blue-500"
          onClick={requestClose}
          type="button"
        >
          Return to our drones
        </button>
      </article>
    </div>
  );
}
