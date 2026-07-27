"use client";

import Image from "next/image";
import { useMemo } from "react";
import type { SectionProject } from "@/app/sections/section-data";
import { SingleWindowCarousel } from "@/global-components/modules/single-window-carousel";
import { StickyLoadedImage } from "@/lib/sticky-loaded-image";

type ProjectCarouselProps = {
  projects: SectionProject[];
  sectionSlug: string;
};

// ProjectCarousel follows the homepage carousel pattern for section responsibility slides.
export function ProjectCarousel({
  projects,
  sectionSlug,
}: ProjectCarouselProps) {
  const slides = useMemo(
    () =>
      projects.map((project, index) => ({
        key: project.slug,
        searchTargetId: `${sectionSlug}-project-${project.slug}`,
        renderContent: ({
          isNearActive,
        }: {
          isNearActive: boolean;
        }) => (
          <ProjectSlide
            index={index}
            loadImage={isNearActive}
            project={project}
            sectionSlug={sectionSlug}
          />
        ),
      })),
    [projects, sectionSlug],
  );

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full sm:mt-10 lg:mt-12">
      <SingleWindowCarousel
        slides={slides}
        labelledBy={`${sectionSlug}-responsibilities-heading`}
        previousLabel="Show previous responsibility"
        nextLabel="Show next responsibility"
        getDotLabel={(pageIndex) =>
          `Show responsibility slide ${pageIndex + 1}`
        }
        searchControllerId={`${sectionSlug}-projects-carousel`}
      />
    </div>
  );
}

type ProjectSlideProps = {
  index: number;
  loadImage: boolean;
  project: SectionProject;
  sectionSlug: string;
};

// ProjectSlide uses a consistent fixed height across every carousel slide.
function ProjectSlide({
  index,
  loadImage,
  project,
  sectionSlug,
}: ProjectSlideProps) {
  return (
    <article className="relative grid h-[34rem] grid-rows-[16rem_minmax(0,1fr)] overflow-hidden rounded-[1.5rem] bg-[linear-gradient(155deg,rgba(255,255,255,0.08)_0%,rgba(84,134,200,0.09)_44%,rgba(0,31,73,0.38)_100%)] text-white sm:h-[38rem] sm:grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:h-[40rem] lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] lg:grid-rows-none">
      {/* Media panel */}
      <div className="relative min-h-0 bg-blue-900">
        {/* Keep image clipping separate from the decorative borders. */}
        <div className="absolute inset-0 overflow-hidden">
          <StickyLoadedImage shouldLoad={loadImage}>
            {({ showImage, isDecoded, onDecoded }) =>
              showImage ? (
                <Image
                  alt={`${project.name} responsibility`}
                  className={`transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                    isDecoded ? "opacity-100" : "opacity-0"
                  }`}
                  decoding="async"
                  draggable={false}
                  fill
                  onLoadingComplete={onDecoded}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  src={project.image}
                  style={{
                    objectFit: project.imageFit ?? "cover",
                    objectPosition:
                      project.imagePosition ?? "center",
                  }}
                />
              ) : null
            }
          </StickyLoadedImage>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.46)_100%)]" />
        </div>

        {/* Decorative image borders */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-5 z-10 h-px bg-blue-100/50"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-5 right-7 z-10 h-10 w-28 border-b border-r border-blue-100/45"
        />
      </div>

      {/* Text panel */}
      <div className="relative z-10 min-h-0 overflow-hidden border-t border-blue-100/20 lg:border-l lg:border-t-0">
        <div className="h-full overflow-y-auto overscroll-contain p-6 [scrollbar-color:rgba(255,255,255,0.65)_transparent] [scrollbar-width:thin] sm:p-8 lg:p-10">
          {/* Top alignment keeps every title on the same starting line. */}
          <div className="flex min-h-full flex-col justify-start">
            <h3 className="shrink-0 break-words text-h6 font-medium leading-[0.95] tracking-[-0.05em] text-white sm:text-h5 lg:text-h4">
              <span
                data-search-target-id={`${sectionSlug}-project-${project.slug}-heading`}
                data-search-managed="true"
                data-search-highlight-mode="text"
              >
                {project.name}
              </span>
            </h3>

            <p
              data-search-target-id={`${sectionSlug}-project-${project.slug}-description`}
              data-search-managed="true"
              data-search-highlight-mode="text"
              className="mt-5 text-b2 leading-relaxed text-blue-50/78 sm:text-b1"
            >
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Always-visible outer card border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] border border-blue-100/35"
      />
    </article>
  );
}