"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SingleWindowCarousel } from "@/global-components/modules/single-window-carousel";
import {
  useSearchNavigation,
  useSearchTarget,
} from "@/global-components/search/search-navigation-provider";
import type { Drone } from "./drone-data";
import { DroneVisual } from "./drone-visual";
import { SpecList } from "./spec-list";
import { GalleryImage } from "./gallery-image";

type DroneDetailsModalProps = {
  drone: Drone;
  onClose: () => void;
};

// DroneDetailsModal shows the selected drone profile in the shared popup layout.
export function DroneDetailsModal({ drone, onClose }: DroneDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLElement | null>(null);
  const { registerSearchTarget } = useSearchNavigation();

  useSearchTarget(`drone-${drone.slug}`, modalRef);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    const cleanups = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>("[data-search-target-id]"),
    ).flatMap((element) => {
      const targetId = element.dataset.searchTargetId;

      return targetId && targetId !== `drone-${drone.slug}`
        ? [
            registerSearchTarget(targetId, {
              element,
              highlightMode:
                element.dataset.searchHighlightMode === "text"
                  ? "text"
                  : "component",
            }),
          ]
        : [];
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [drone.slug, registerSearchTarget]);

  const hasGallery = (drone.gallery?.length ?? 0) > 0;
  const slides = useMemo(() => getDroneSlides(drone), [drone]);
  const isVisible = isOpen && !isClosing;

  // Starts the reveal animation on mount after initial paint.
  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 20);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // requestClose plays the exit animation before removing the modal.
  const requestClose = () => {
    setIsClosing(true);
    window.setTimeout(onClose, 280);
  };

  return (
    <div
      className={`absolute inset-0 z-40 h-full w-full overflow-hidden bg-blue-950/40 backdrop-blur-sm p-3 sm:p-6 lg:p-8 flex items-center justify-center transform-gpu will-change-[opacity] transition-opacity duration-300 ease-out ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <article
        ref={modalRef}
        className={`relative z-10 mx-auto flex w-full max-w-[1380px] max-h-[88vh] flex-col overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-blue-50/95 shadow-2xl p-4 sm:p-6 lg:p-8 my-auto transform-gpu will-change-[transform,opacity] transition-all duration-300 ease-out ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
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
          <div className="mx-auto min-w-0 w-full max-w-[min(100%,720px)] transform-gpu">
            {drone.banner ? <DroneBannerHeader banner={drone.banner} /> : null}
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
              <DroneSlide drone={drone} image={drone.heroImage} index={0} loadImage />
            )}
          </div>

          <DroneInfoPanel drone={drone} />
        </div>
      </article>
    </div>
  );
}

// DroneBannerHeader renders a feature banner notification header with a link button above the drone gallery.
function DroneBannerHeader({ banner }: { banner: NonNullable<Drone["banner"]> }) {
  return (
    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-blue-200/80 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-md sm:px-5 sm:py-3">
      <span className="text-b2 sm:text-b1 font-bold text-blue-950">
        {banner.text}
      </span>
      <Link
        href={banner.href}
        className="group inline-flex items-center gap-1.5 rounded-full bg-blue-900 px-4 py-1.5 text-b2 sm:text-b1 font-bold text-white shadow-sm transition-all duration-300 hover:bg-blue-800 hover:shadow-md hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900/40"
      >
        <span>{banner.buttonText}</span>
        <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

// DroneInfoPanel renders the drone details, specifications, and title in a scrollable side panel.
function DroneInfoPanel({ drone }: { drone: Drone }) {
  return (
    <aside
      className="mx-auto flex h-full max-h-[68vh] w-full max-w-[min(100%,600px)] flex-col min-h-0 overflow-hidden rounded-[1.5rem] bg-blue-950/90 px-4 py-5 text-white backdrop-blur-md sm:px-6 sm:py-6 lg:h-[65vh] lg:max-h-[600px] lg:w-[24vw] lg:min-w-[300px] lg:max-w-[380px] lg:mr-10 xl:mr-14 transform-gpu"
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
        {drone.dimensions.length > 0 ? (
          <div className="border-t border-white/15 pt-3">
            <SpecList specs={drone.dimensions} title="Dimensions" tone="dark" compact />
          </div>
        ) : null}

        {/* Specs: Key Features */}
        {drone.features.length > 0 ? (
          <div className="border-t border-white/15 pt-3">
            <SpecList specs={drone.features} title="Key Features" tone="dark" compact />
          </div>
        ) : null}
      </div>
    </aside>
  );
}

// DroneSlide renders a single slide within the drone details image gallery.
function DroneSlide({ drone, image, index }: { drone: Drone; image?: string; index: number }) {
  return (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[1.5rem] transform-gpu">
      {index === 0 ? (
        <div className="absolute inset-0">
          <DroneVisual drone={drone} />
        </div>
      ) : image ? (
        <GalleryImage
          alt={`${drone.name} gallery image ${index}`}
          src={image}
          sizes="(min-width: 1024px) 62vw, 100vw"
        />
      ) : (
        <div className="absolute inset-0 p-8 sm:p-12 lg:p-16">
          <DroneVisual drone={{ name: drone.name }} />
        </div>
      )}

      <div className="absolute inset-0 rounded-[inherit] pointer-events-none" />
    </div>
  );
}

function getDroneSlides(drone: Drone) {
  const images = [drone.heroImage, ...(drone.gallery ?? [])];

  return images.map((image, index) => ({
    key: `${drone.slug}-${image ?? "placeholder"}-${index}`,
    renderContent: ({ isNearActive }: { isNearActive: boolean }) => (
      <DroneSlide
        drone={drone}
        image={image}
        index={index}
        loadImage={isNearActive}
      />
    ),
  }));
}
