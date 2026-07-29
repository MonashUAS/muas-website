"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchableText } from "@/global-components/search/searchable-text";
import { useIsMobile } from "@/lib/use-is-mobile";
import { getVideoPosterSrc } from "@/lib/media-paths";
import { usePreparedMediaSlideshow } from "@/lib/use-prepared-media-slideshow";
import { heroSlidesDesktop, heroSlidesMobile } from "../data/hero-slides";
import { usePrefersReducedMotion } from "../utils/use-prefers-reduced-motion";

// The homepage hero owns only slideshow behavior; slide content lives in data
// so the media sequence can be updated without touching interaction code.
export function HomepageHero() {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const slides = isMobile ? heroSlidesMobile : heroSlidesDesktop;

  const {
    handleImageDecoded,
    handleMediaError,
    handleVideoEnded,
    mountedSlideIndexes,
    registerVideoRef,
    sectionRef,
    visibleSlide,
  } = usePreparedMediaSlideshow({
    slides,
    prefersReducedMotion,
  });

  return (
    <section
      id="homepage-hero"
      ref={sectionRef}
      className="relative viewport-fold scroll-mt-20 overflow-hidden bg-black-500 text-white"
    >
      <div className="absolute inset-0">
        {slides.map((slide, index) => {
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
              {slide.type === "image" ? (
                // next/image optimizes still media; videos stay native for autoplay support.
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  preload={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="100vw"
                  className="object-cover"
                  onLoadingComplete={() => handleImageDecoded(index)}
                  onError={() => handleMediaError(index)}
                />
              ) : (
                <video
                  ref={registerVideoRef(index)}
                  src={slide.src}
                  poster={getVideoPosterSrc(slide.src)}
                  muted
                  playsInline
                  preload={
                    isActive || mountedSlideIndexes.has(index)
                      ? "auto"
                      : "metadata"
                  }
                  className="h-full w-full object-cover"
                  onEnded={() => handleVideoEnded(index)}
                  onError={() => handleMediaError(index)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(0,31,73,0.76)_0%,rgba(2,4,10,0.48)_45%,rgba(5,8,13,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(84,134,200,0.22),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.64),transparent)]" />

      <div className="relative z-10 mx-auto flex viewport-fold w-full max-w-6xl -translate-y-12 flex-col items-center justify-center px-6 py-20 text-center sm:px-8 lg:px-12">
        <Image
          src="/logos/logo-white-clear-background.png"
          alt="MUAS Logo"
          width={260}
          height={74}
          priority
          className="h-auto w-[190px] sm:w-[240px] lg:w-[280px]"
        />

        <SearchableText
          as="p"
          searchId="home-hero-heading"
          className="mt-8 text-[clamp(2.4rem,7vw,5.6rem)] font-black leading-[0.95] tracking-[-0.05em] text-white"
        >
          Redefining Drone Technology
        </SearchableText>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/our-drones"
            data-search-target-id="home-hero-explore-drones"
            data-search-highlight-mode="text"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-b1 text-blue-900 transition-colors duration-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            Explore Our Drones
          </Link>
          <Link
            href="/recruitment"
            data-search-target-id="home-hero-join-team"
            data-search-highlight-mode="text"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#051b5e] px-6 text-b1 text-white transition-colors duration-300 hover:bg-[#0b2a7a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none"
          >
            Join The Team
          </Link>
        </div>
      </div>
    </section>
  );
}
