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
export function ProjectCarousel({ projects, sectionSlug }: ProjectCarouselProps) {
  const slides = useMemo(
    () =>
      projects.map((project, index) => ({
        key: project.slug,
        searchTargetId: `${sectionSlug}-project-${project.slug}`,
        renderContent: ({ isNearActive }: { isNearActive: boolean }) => (
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
        getDotLabel={(pageIndex) => `Show responsibility slide ${pageIndex + 1}`}
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

// ProjectSlide keeps every responsibility inside one fixed-size card layout.
function ProjectSlide({ index, loadImage, project, sectionSlug }: ProjectSlideProps) {
  return (
    <article className="grid h-[min(70svh,36rem)] grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)] bg-[linear-gradient(155deg,rgba(255,255,255,0.08)_0%,rgba(84,134,200,0.09)_44%,rgba(0,31,73,0.38)_100%)] text-white sm:h-[min(72svh,38rem)] lg:h-[min(68svh,40rem)] lg:grid-cols-[minmax(0,0.58fr)_minmax(320px,0.42fr)] lg:grid-rows-none">
      <div className="relative min-h-0 overflow-hidden bg-blue-900">
        <StickyLoadedImage shouldLoad={loadImage}>
          {({ showImage, isDecoded, onDecoded }) =>
            showImage ? (
              <Image
                alt={`${project.name} responsibility`}
                className={`object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none ${
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
                  objectPosition: project.imagePosition ?? "center",
                }}
              />
            ) : null
          }
        </StickyLoadedImage>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,31,73,0.46)_100%)]" />
        <div className="absolute inset-x-6 top-5 h-px bg-blue-100/35" />
        <div className="absolute bottom-5 right-7 h-10 w-28 border-b border-r border-blue-100/30" />
      </div>

      <div className="flex min-h-0 flex-col justify-center overflow-hidden p-6 sm:p-8 lg:p-10">
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
          className="mt-5 min-h-0 overflow-hidden text-b2 leading-relaxed text-blue-50/78 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6] sm:text-b1 sm:[-webkit-line-clamp:8] lg:[-webkit-line-clamp:12]"
        >
          {project.description}
        </p>
      </div>
    </article>
  );
}
