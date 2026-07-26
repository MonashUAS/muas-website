"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { headerContentContainerClass } from "@/global-components/layout/sidebar/navbar-classes";
import { SingleWindowCarousel } from "@/global-components/modules/single-window-carousel";
import { StickyLoadedImage } from "@/lib/sticky-loaded-image";
import { homepageSections } from "../data/sections";

// A dependency-free single-window carousel for the homepage team gallery.
// Placeholder image paths are maintained in sections.ts.
export function HomepageSectionsExplorer() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [prepareAllSlides, setPrepareAllSlides] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (prepareAllSlides || !section) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setPrepareAllSlides(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setPrepareAllSlides(true);
        observer.disconnect();
      },
      {
        rootMargin: "2400px 0px",
        threshold: 0,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [prepareAllSlides]);

  const slides = useMemo(
    () =>
      homepageSections.map((section) => ({
        key: section.href,
        searchTargetId: `home-sections-${section.href.replaceAll("/", "-").replace(/^-/, "")}`,
        renderContent: ({ isNearActive }: { isNearActive: boolean }) => (
          <SectionTile
            section={section}
            loadImage={prepareAllSlides || isNearActive}
          />
        ),
      })),
    [prepareAllSlides],
  );

  return (
    <section
      id="homepage-sections"
      ref={sectionRef}
      className="bg-[linear-gradient(180deg,#02040a_0%,#001f49_46%,#02040a_100%)] py-20 text-white sm:py-24 lg:py-28"
      aria-labelledby="homepage-sections-heading"
    >
      <div className={headerContentContainerClass}>
        <div className="grid gap-12 lg:grid-cols-[minmax(280px,0.82fr)_minmax(0,1.18fr)] lg:items-center lg:gap-16">
          <div className="max-w-2xl">
            <h2
              id="homepage-sections-heading"
              className="text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-white"
            >
              Explore Our Sections
            </h2>

            <p className="mt-7 max-w-xl text-b1 leading-7 text-blue-50/75 sm:text-subtitle">
              From operations to propulsion, every MUAS section
              plays a critical role in taking our systems from concept to reality.
            </p>
          </div>

          <SingleWindowCarousel
            slides={slides}
            labelledBy="homepage-sections-heading"
            previousLabel="Show previous section"
            nextLabel="Show next section"
            getDotLabel={(pageIndex) => `Show section slide ${pageIndex + 1}`}
            searchControllerId="homepage-sections-carousel"
          />
        </div>
      </div>
    </section>
  );
}

type SectionTileProps = {
  section: (typeof homepageSections)[number];
  loadImage: boolean;
};

function SectionTile({ section, loadImage }: SectionTileProps) {
  return (
    <Link
      href={section.href}
      className="group relative block h-[360px] overflow-hidden rounded-[1.5rem] bg-blue-950 text-white outline-none transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-800/55 motion-reduce:transition-none sm:h-[430px] lg:h-[560px]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 shadow-[0_25px_50px_-12px_rgba(0,31,73,0.45)] transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />

      <StickyLoadedImage shouldLoad={loadImage}>
        {({ showImage, isDecoded, onDecoded }) =>
          showImage ? (
            <Image
              src={section.image}
              alt={section.alt}
              fill
              sizes="(min-width: 1024px) 54vw, 100vw"
              onLoadingComplete={onDecoded}
              className={`rounded-[inherit] object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045] group-focus-visible:scale-[1.045] motion-reduce:transition-none ${
                isDecoded ? "opacity-100" : "opacity-0"
              }`}
              style={{ objectPosition: section.objectPosition ?? "50% 50%" }}
            />
          ) : null
        }
      </StickyLoadedImage>

      <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,31,73,0.4)_44%,rgba(0,0,0,0.88))]" />
      <div className="absolute inset-0 rounded-[inherit] bg-blue-500/0 transition-colors duration-500 group-hover:bg-blue-500/[0.08] group-focus-visible:bg-blue-500/[0.08] motion-reduce:transition-none" />

      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
        <div className="max-w-xl">
          <h3 className="text-[clamp(2.3rem,4.4vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.05em]">
            <span
              data-search-target-id={`home-sections-${section.href.replaceAll("/", "-").replace(/^-/, "")}-heading`}
              data-search-managed="true"
              data-search-highlight-mode="text"
            >
              {section.title}
            </span>
          </h3>

          <p
            data-search-target-id={`home-sections-${section.href.replaceAll("/", "-").replace(/^-/, "")}-description`}
            data-search-managed="true"
            data-search-highlight-mode="text"
            className="mt-4 max-w-md text-b1 leading-6 text-blue-50/82 sm:text-subtitle"
          >
            {section.description}
          </p>

          <span
            data-search-target-id={`home-sections-${section.href.replaceAll("/", "-").replace(/^-/, "")}-cta`}
            data-search-managed="true"
            data-search-highlight-mode="text"
            className="mt-6 inline-flex items-center gap-3 text-b2 font-medium uppercase tracking-[0.18em] text-blue-50/84 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white motion-reduce:transition-none"
          >
            Visit section
            <span
              className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
