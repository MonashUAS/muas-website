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
    window.setTimeout(onClose, 540);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 top-[var(--header-height)] z-40 overflow-hidden bg-blue-50 p-3 text-blue-950 transition-opacity duration-[520ms] ease-out sm:p-5 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/drones/clouds.jpg"
          alt=""
          fill
          sizes="100vw"
          className="scale-105 object-cover blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-white/55" />
      </div>

      <article
        className="relative z-10 mx-auto flex h-full w-full max-w-[1720px] flex-col px-1 [--drone-modal-frame-height:min(32svh,calc((100svh-var(--header-height)-11rem)/2))] sm:px-4 sm:[--drone-modal-frame-height:min(34svh,calc((100svh-var(--header-height)-12rem)/2))] lg:px-6 lg:[--drone-modal-frame-height:min(66svh,calc(100svh-var(--header-height)-11rem))]"
      >
        <button
          aria-label="Close drone details"
          className="absolute right-1 top-0 z-30 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-blue-900 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/30 motion-reduce:transition-none sm:right-3 sm:h-12 sm:w-12"
          onClick={requestClose}
          type="button"
        >
          <X aria-hidden size={22} strokeWidth={2.8} />
        </button>

        <div
          className={`absolute left-1/2 top-5 z-10 w-[calc(100%-6rem)] max-w-[92vw] -translate-x-1/2 text-center text-blue-900 transition-opacity duration-[520ms] ease-out sm:top-5 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2
            id="drone-details-heading"
            className="text-h3 font-black leading-none tracking-[-0.05em] text-blue-900 sm:text-h1"
          >
            {drone.name}
          </h2>
        </div>

        <div className="grid min-h-0 flex-1 content-center items-center justify-center gap-3 pt-20 sm:gap-4 sm:pt-24 lg:grid-cols-[1fr_auto] lg:gap-6 xl:gap-8">
          <div
            className={`mx-auto min-w-0 w-full max-w-[min(100%,calc(var(--drone-modal-frame-height)*1.5+6rem))] transition-opacity duration-[520ms] ease-out motion-reduce:transition-none sm:max-w-[min(100%,calc(var(--drone-modal-frame-height)*1.5+8rem))] lg:max-w-[min(100%,calc(var(--drone-modal-frame-height)*1.5+10rem))] ${
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

function DroneInfoPanel({
  drone,
  isVisible,
}: {
  drone: Drone;
  isVisible: boolean;
}) {
  return (
    <aside
      className={`mx-auto flex h-auto max-h-[var(--drone-modal-frame-height)] w-full max-w-[min(100%,calc(var(--drone-modal-frame-height)*1.5+6rem))] flex-col overflow-hidden rounded-[1.5rem] border border-white/35 bg-blue-950/90 px-4 py-4 text-white shadow-[0_28px_96px_rgba(0,0,0,0.28)] backdrop-blur-md transition-opacity duration-[520ms] ease-out sm:max-w-[min(100%,calc(var(--drone-modal-frame-height)*1.5+8rem))] sm:px-5 sm:py-5 lg:h-[var(--drone-modal-frame-height)] lg:w-[20vw] lg:max-w-[20vw] lg:px-6 lg:py-6 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1 sm:gap-8 lg:overflow-y-auto">
        <div>
          <p className="text-b2 leading-relaxed text-blue-50/80 sm:text-b1">
            {drone.description.join(" ")}
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:gap-8 lg:grid-cols-1">
          <SpecList specs={drone.dimensions} title="Dimensions" tone="dark" compact />
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