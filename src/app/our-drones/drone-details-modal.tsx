"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SingleWindowCarousel } from "@/global-components/modules/single-window-carousel";
import type { Drone } from "./drone-data";
import { DroneVisual } from "./drone-visual";
import { SpecList } from "./spec-list";

type DroneDetailsModalProps = {
  drone: Drone;
  onClose: () => void;
};

// DroneDetailsModal shows the selected drone profile in the shared popup layout.
export function DroneDetailsModal({ drone, onClose }: DroneDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const hasGallery = (drone.gallery?.length ?? 0) > 0;
  const slides = useMemo(() => getDroneSlides(drone), [drone]);
  const isVisible = isOpen && !isClosing;

  // Starts the reveal animation on mount.
  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => setIsOpen(true));

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  // requestClose plays the exit animation before removing the modal.
  const requestClose = () => {
    setIsClosing(true);
    window.setTimeout(onClose, 540);
  };

  return (
    <div
      className={`absolute inset-0 z-40 h-full w-full overflow-hidden bg-blue-950/40 backdrop-blur-sm p-3 sm:p-6 lg:p-8 flex items-center justify-center transition-opacity duration-[520ms] ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <article
        className="relative z-10 mx-auto flex w-full max-w-[1380px] max-h-[88vh] flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-blue-50/95 shadow-2xl p-4 sm:p-6 lg:p-8 my-auto"
      >
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit] bg-blue-100">
          <Image
            src="/images/drones/clouds.jpg"
            alt=""
            fill
            sizes="100vw"
            className="absolute inset-0 z-0 opacity-40 select-none object-cover"
            priority
          />
        </div>

        <button
          aria-label="Close drone details"
          className="absolute right-4 top-4 z-30 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/30 motion-reduce:transition-none sm:right-6 sm:top-6 lg:right-8 lg:top-7 sm:h-12 sm:w-12"
          onClick={requestClose}
          type="button"
        >
          <X aria-hidden size={22} strokeWidth={2.8} />
        </button>

        <div className="relative z-10 grid min-h-0 flex-1 content-center items-center justify-center gap-4 pt-12 sm:pt-14 lg:pt-14 lg:grid-cols-[1fr_auto] lg:gap-8 overflow-hidden">
          <div
            className={`mx-auto min-w-0 w-full max-w-[min(100%,720px)] transition-opacity duration-[520ms] ease-out motion-reduce:transition-none ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {hasGallery ? (
              <SingleWindowCarousel
                slides={slides}
                labelledBy="drone-details-heading"
                previousLabel={`Show previous ${drone.name} image`}
                nextLabel={`Show next ${drone.name} image`}
                getDotLabel={(pageIndex) => `Show ${drone.name} image ${pageIndex + 1}`}
                autoplay={false}
                dotTone="blue"
              />
            ) : (
              <DroneSlide drone={drone} image={drone.heroImage} index={0} />
            )}
          </div>

          <DroneInfoPanel drone={drone} isVisible={isVisible} />
        </div>
      </article>
    </div>
  );
}

// DroneInfoPanel renders the drone details, specifications, and title in a scrollable side panel.
function DroneInfoPanel({
  drone,
  isVisible,
}: {
  drone: Drone;
  isVisible: boolean;
}) {
  return (
    <aside
      className={`mx-auto flex h-full max-h-[68vh] w-full max-w-[min(100%,600px)] flex-col min-h-0 overflow-hidden rounded-[1.5rem] bg-blue-950/90 px-4 py-5 text-white backdrop-blur-md transition-opacity duration-[520ms] ease-out sm:px-6 sm:py-6 lg:h-[65vh] lg:max-h-[600px] lg:w-[24vw] lg:min-w-[300px] lg:max-w-[380px] lg:mr-10 xl:mr-14 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2 text-white scrollbar-thin">
        {/* Drone Name heading */}
        <div>
          <h2
            id="drone-details-heading"
            className="text-h6 sm:text-h5 font-black leading-tight tracking-[-0.03em] text-white"
          >
            {drone.name}
          </h2>
        </div>

        {/* Description */}
        <div>
          <p className="text-b2 leading-relaxed text-blue-50/90 sm:text-b1">
            {drone.description.join(" ")}
          </p>
        </div>

        {/* Specs: Dimensions */}
        <div className="border-t border-white/15 pt-3">
          <SpecList specs={drone.dimensions} title="Dimensions" tone="dark" compact />
        </div>

        {/* Specs: Key Features */}
        <div className="border-t border-white/15 pt-3">
          <SpecList specs={drone.features} title="Key Features" tone="dark" compact />
        </div>
      </div>
    </aside>
  );
}

function DroneSlide({ drone, image, index }: { drone: Drone; image?: string; index: number }) {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[1.5rem]">
      {index === 0 ? (
        <div className="absolute inset-0">
          <DroneVisual drone={drone} />
        </div>
      ) : image ? (
        <Image
          alt={`${drone.name} gallery image ${index}`}
          src={image}
          fill
          sizes="(min-width: 1024px) 62vw, 100vw"
          className="rounded-[inherit] object-cover"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 p-8 sm:p-12 lg:p-16">
          <DroneVisual drone={{ name: drone.name }} />
        </div>
      )}

      <div className="absolute inset-0 rounded-[inherit]" />
    </div>
  );
}

function getDroneSlides(drone: Drone) {
  const images = [drone.heroImage, ...(drone.gallery ?? [])];

  return images.map((image, index) => ({
    key: `${drone.slug}-${image ?? "placeholder"}-${index}`,
    content: <DroneSlide drone={drone} image={image} index={index} />,
  }));
}