"use client";

import Image from "next/image";
import { usePreparedMediaSlideshow } from "@/lib/use-prepared-media-slideshow";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { nfcHeroSlides } from "../nfc-2025-data";

/**
 * Renders the full-viewport Hero section for the NFC 2025 page.
 * Displays an automated image slideshow of Peregrine Mk II visuals at NFC 2025
 * with white heading and gradient blue sub-heading that slowly fades into view.
 */
export function NFCHero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const {
    handleImageDecoded,
    handleMediaError,
    mountedSlideIndexes,
    sectionRef,
    visibleSlide,
  } = usePreparedMediaSlideshow({
    slides: nfcHeroSlides,
    prefersReducedMotion,
  });

  return (
    <section
      id="nfc-hero"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] scroll-mt-20 items-center justify-center overflow-hidden bg-black px-6 pt-[var(--header-height)] text-white sm:px-10"
    >
      <style jsx>{`
        @keyframes nfc-hero-fade-in {
          0% {
            opacity: 0;
            transform: translateY(1.25rem) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .nfc-hero-text-fade {
          animation: nfc-hero-fade-in 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
          will-change: opacity, transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .nfc-hero-text-fade {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      {/* Slideshow background images */}
      <div className="absolute inset-0">
        {nfcHeroSlides.map((slide, index) => {
          if (!mountedSlideIndexes.has(index)) {
            return null;
          }

          const isActive = index === visibleSlide;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-[50%_42%]"
                onLoadingComplete={() => handleImageDecoded(index)}
                onError={() => handleMediaError(index)}
              />
            </div>
          );
        })}
      </div>

      {/* Overlay Gradients for Depth and Readability */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,7,20,0.35)_0%,rgba(0,7,20,0.2)_42%,rgba(0,7,20,0.75)_100%)]" />

      {/* Hero Content Box with Slow Fade Animation */}
      <div className="nfc-hero-text-fade relative z-10 mx-auto flex w-full max-w-6xl -translate-y-10 flex-col items-center text-center sm:-translate-y-12">
        <h1 className="text-[clamp(3.5rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.065em] text-white">
          NFC 2025
        </h1>
        <p className="mt-3 inline-block px-3 py-2 text-[clamp(2.2rem,5vw,4.8rem)] font-bold leading-[1.08] tracking-[-0.065em] bg-gradient-to-r from-blue-200 to-blue-600 bg-clip-text text-transparent sm:mt-5">
          Peregrine MK II
        </p>
      </div>
    </section>
  );
}
