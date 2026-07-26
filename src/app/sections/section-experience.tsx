"use client";

import Image from "next/image";
import { ProjectCarousel } from "@/app/sections/project-carousel";
import { defaultPortraitPosition } from "@/app/our-team/data/portrait-assets";
import { AnimatedTextHighlight } from "@/global-components/animated-text-highlight";
import { headerContentContainerClass } from "@/global-components/layout/sidebar/navbar-classes";
import { NextDestinationLink } from "@/global-components/next-destination-link";
import { getVideoPosterSrc } from "@/lib/media-paths";
import { usePreparedMediaSlideshow } from "@/lib/use-prepared-media-slideshow";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import type { SectionHeroMedia, SectionLead, TeamSection } from "./section-data";

type SectionExperienceProps = {
  nextSection: TeamSection;
  section: TeamSection;
};

// SectionExperience renders the complete shared page layout for each MUAS team section.
export function SectionExperience({ nextSection, section }: SectionExperienceProps) {
  return (
    <div className="min-h-full bg-background text-white">
      <SectionHero key={section.slug} section={section} />
      <main className="relative z-10">
        <Projects section={section} />
        <NextDestinationLink
          id={`next-${nextSection.slug}`}
          href={`/sections/${nextSection.slug}`}
          title={`Next: ${nextSection.name}`}
          description={nextSection.shortDescription}
          imageSrc={
            section.nextSectionImage?.src ??
            nextSection.projects[0]?.image ??
            "/images/homepage/quick-nav/our-drones.webp"
          }
          imageAlt={`${nextSection.name} preview`}
          imageFit={section.nextSectionImage?.fit}
          imagePosition={section.nextSectionImage?.position}
        />
      </main>
    </div>
  );
}

// SectionHero introduces each team section with full-bleed media and lead profiles.
function SectionHero({ section }: { section: TeamSection }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroMedia = section.heroMedia;
  const {
    handleImageDecoded,
    handleMediaError,
    handleVideoEnded,
    hasMultipleSlides,
    mountedSlideIndexes,
    registerVideoRef,
    sectionRef,
    visibleSlide,
  } = usePreparedMediaSlideshow({
    slides: heroMedia,
    prefersReducedMotion,
  });

  return (
    <section
      id="team-overview"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] scroll-mt-20 items-center justify-center overflow-hidden bg-black-500 px-6 pt-[var(--header-height)] text-white sm:px-10"
    >
      <div className="absolute inset-0 z-0">
        {heroMedia.map((media, index) => {
          if (!mountedSlideIndexes.has(index)) {
            return null;
          }

          const isActive = index === visibleSlide;

          return (
            <div
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              key={media.id}
            >
              <HeroMedia
                isSingleSlide={!hasMultipleSlides}
                media={media}
                onImageDecoded={() => handleImageDecoded(index)}
                onError={() => handleMediaError(index)}
                onVideoEnded={() => handleVideoEnded(index)}
                priority={index === 0}
                refCallback={registerVideoRef(index)}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 z-0 bg-black/45" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(0,7,20,0.3)_0%,rgba(0,7,20,0.18)_42%,rgba(0,7,20,0.68)_100%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(84,134,200,0.18),transparent_34%)]" />

      <div className="relative z-10 mx-auto flex w-[calc(100vw-3rem)] max-w-6xl -translate-y-8 flex-col items-center py-10 text-center sm:w-full sm:-translate-y-4 sm:py-16">
        <div className="flex w-full min-w-0 max-w-full flex-col items-center">
          <h1 className="w-full min-w-0 max-w-full origin-center scale-x-[0.9] text-balance text-[clamp(2.3rem,9.4vw,2.8rem)] font-black leading-[0.95] tracking-[-0.065em] text-white sm:max-w-[12ch] sm:scale-x-100 sm:text-[clamp(3.5rem,7vw,7rem)]">
            <AnimatedTextHighlight
              className="inline max-w-full"
              variant="goldSingleUnderline"
            >
              {section.name}
            </AnimatedTextHighlight>
          </h1>

          <p className="mt-6 w-full max-w-[20rem] text-[0.95rem] font-medium leading-[1.45] tracking-[-0.015em] text-blue-50 sm:mt-10 sm:max-w-[52rem] sm:text-[clamp(1.15rem,1.55vw,1.6rem)] sm:leading-[1.55]">
            {section.description}
          </p>
        </div>

        <div className="mt-6 flex min-h-[10.5rem] w-full max-w-2xl flex-col items-center justify-start sm:mt-10 sm:min-h-[12.75rem]">
          <h2 className="text-b1 font-medium uppercase leading-none tracking-[0.2em] text-blue-50/74">
            Led by
          </h2>

          <div className="mt-5 flex w-full flex-wrap justify-center gap-6 sm:mt-7 sm:gap-8">
            {section.leads.map((lead) => (
              <LeadProfile key={lead.name} lead={lead} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type HeroMediaProps = {
  isSingleSlide: boolean;
  media: SectionHeroMedia;
  onImageDecoded: () => void;
  onError: () => void;
  onVideoEnded: () => void;
  priority: boolean;
  refCallback: (element: HTMLVideoElement | null) => void;
};

function HeroMedia({
  isSingleSlide,
  media,
  onImageDecoded,
  onError,
  onVideoEnded,
  priority,
  refCallback,
}: HeroMediaProps) {
  const mediaStyle = {
    objectFit: media.fit ?? "cover",
    objectPosition: media.position ?? "center",
  };

  if (media.type === "image") {
    return (
      <Image
        alt={media.alt}
        className="object-cover"
        fill
        onError={onError}
        onLoadingComplete={onImageDecoded}
        preload={priority}
        fetchPriority={priority ? "high" : "auto"}
        sizes="100vw"
        src={media.src}
        style={mediaStyle}
      />
    );
  }

  return (
    <video
      aria-label="Section hero video"
      autoPlay={isSingleSlide}
      className="h-full w-full object-cover"
      loop={isSingleSlide}
      muted
      onEnded={onVideoEnded}
      onError={onError}
      playsInline
      poster={getVideoPosterSrc(media.src)}
      preload={isSingleSlide ? "metadata" : "none"}
      ref={refCallback}
      src={media.src}
      style={mediaStyle}
    />
  );
}

// LeadProfile renders a single section lead headshot and name.
function LeadProfile({ lead }: { lead: SectionLead }) {
  return (
    <figure className="flex min-w-0 max-w-52 flex-col items-center text-center sm:max-w-60">
      <Image
        alt={lead.name}
        className="aspect-square w-32 rounded-full object-cover shadow-[0_18px_42px_rgba(0,0,0,0.34)] sm:w-44 lg:w-52"
        decoding="async"
        height={208}
        sizes="(min-width: 1024px) 13rem, (min-width: 640px) 11rem, 8rem"
        src={lead.image.src}
        style={{
          objectPosition: lead.image.position ?? defaultPortraitPosition,
        }}
        width={208}
      />

      <figcaption className="mt-4 break-words text-b2 font-medium leading-tight tracking-[-0.03em] text-white sm:text-b1 lg:text-subtitle">
        {lead.name}
      </figcaption>
    </figure>
  );
}

// Projects renders the section responsibilities carousel on the shared MUAS page background.
function Projects({ section }: { section: TeamSection }) {
  return (
    <section
      id="team-projects"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#02040a_0%,#001126_46%,#001f49_100%)] py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_18%,rgba(84,134,200,0.18),transparent_30%),radial-gradient(circle_at_84%_68%,rgba(0,74,173,0.2),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:86px_86px] opacity-24" />

      <div className={headerContentContainerClass}>
        <h2
          id={`${section.slug}-responsibilities-heading`}
          data-search-target-id={`${section.slug}-responsibilities-heading`}
          data-search-managed="true"
          data-search-highlight-mode="text"
          className="text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white"
        >
          Responsibilities
        </h2>

        <ProjectCarousel projects={section.projects} sectionSlug={section.slug} />
      </div>
    </section>
  );
}
