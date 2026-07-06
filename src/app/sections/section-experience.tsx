"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ProjectCarousel } from "@/app/sections/project-carousel";
import type { SectionLead, TeamSection } from "./section-data";

type SectionExperienceProps = {
  nextSection: TeamSection;
  section: TeamSection;
};

type TransitionRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type InteractiveBackgroundProps = {
  children: React.ReactNode;
  className: string;
};

// SectionExperience renders the animated client-side section page experience.
export function SectionExperience({ nextSection, section }: SectionExperienceProps) {
  const [videoShade, setVideoShade] = useState(0.45);

  // Updates the fixed hero shade as content scrolls over the video.
  useEffect(() => {
    const handleScroll = () => {
      const foldProgress = clamp(window.scrollY / (window.innerHeight * 0.75), 0, 1);

      setVideoShade(0.45 + foldProgress * 0.4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative bg-blue-900 text-white">
      <HeroVideo section={section} shade={videoShade} />
      <section className="min-h-[calc(100vh-5rem)]" />
      <main className="relative z-10">
        <ContentSections section={section} />
        <NextSection section={nextSection} />
      </main>
    </div>
  );
}

// HeroVideo renders the fixed autoplaying section video behind the folding content.
function HeroVideo({ section, shade }: { section: TeamSection; shade: number }) {
  return (
    <section className="fixed inset-x-0 top-20 z-0 flex h-[calc(100vh-5rem)] items-center justify-center overflow-hidden ">
      <video
        aria-label={`${section.name} hero video`}
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        src={section.heroVideo}
      />
      <div className="absolute inset-0 bg-black transition-colors duration-200" style={{ opacity: shade }} />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center uppercase">
        <h1 className="text-h4 font-black leading-none sm:text-h2 tracking-[-0.05em]">{section.name}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-b2 font-black leading-relaxed sm:text-b1">
          {section.shortDescription}
        </p>
      </div>
    </section>
  );
}

// ContentSections groups description, leads, and projects into one shared interactive surface.
function ContentSections({ section }: { section: TeamSection }) {
  return (
    <StaticSectionBackground className="px-6">
      <Description section={section} />
      <Projects section={section} />
    </StaticSectionBackground>
  );
}

// Description renders the section overview and lead portraits over an interactive blue field.
function Description({ section }: { section: TeamSection }) {
  return (
    <section
      id="team-overview"
      className="mx-auto flex h-[calc(100vh-10rem)] w-full max-w-5xl scroll-mt-20 flex-col items-center justify-center py-20 text-center"
    >
      <ParticleText text={section.description} />
      <h2 className="mt-14 text-subtitle font-black">
        {section.leads.length === 1 ? "Section Lead" : "Section Leads"}
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-10">
        {section.leads.map((lead) => (
          <LeadProfile key={lead.name} lead={lead} />
        ))}
      </div>
    </section>
  );
}

// LeadProfile renders a single section lead headshot and name on a transparent card.
function LeadProfile({ lead }: { lead: SectionLead }) {
  return (
    <figure className="flex w-40 flex-col items-center bg-transparent px-4 py-5 text-center">
      <Image
        alt={lead.name}
        className="h-24 w-24 rounded-full object-cover"
        height={96}
        src={lead.image}
        width={96}
      />
      <figcaption className="mt-5 text-b1 font-black">{lead.name}</figcaption>
    </figure>
  );
}

// Projects renders the project carousel after slowly fading into view.
function Projects({ section }: { section: TeamSection }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Watches the projects band and starts its entry fade when it reaches the viewport.
  useEffect(() => {
    const element = sectionRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="team-projects"
      ref={sectionRef}
      className={`flex h-[calc(100vh)] scroll-mt-20 flex-col items-center justify-center overflow-hidden py-20 transition duration-[1600ms] ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <h2 className="text-center text-h6 font-black sm:text-h5 tracking-[-0.05em]">Projects</h2>
      <ProjectCarousel projects={section.projects} />
    </section>
  );
}

// NextSection renders the linked preview and zooms it to fullscreen before routing.
function NextSection({ section }: { section: TeamSection }) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [transitionRect, setTransitionRect] = useState<TransitionRect | null>(null);
  const [isTransitionFullScreen, setIsTransitionFullScreen] = useState(false);

  // handleNextClick measures the preview before animating it into the destination page.
  const handleNextClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const preview = previewRef.current;

    if (!preview) {
      router.push(`/sections/${section.slug}`);
      return;
    }

    const rect = preview.getBoundingClientRect();

    setTransitionRect({
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width,
    });
    window.requestAnimationFrame(() => {
      setIsTransitionFullScreen(true);
    });
    window.setTimeout(() => {
      router.push(`/sections/${section.slug}`);
    }, 760);
  };

  return (
    <section className="relative z-10 flex h-[calc(100vh-8rem)] items-center justify-center bg-white px-6 py-20 text-blue-900">
      <Link
        aria-label={`Learn about ${section.name}`}
        className="group flex max-w-4xl flex-col items-center text-center"
        href={`/sections/${section.slug}`}
        onClick={handleNextClick}
      >
        <h2 className="text-h6 font-black leading-tight sm:text-h5 tracking-[-0.05em]">
          Next Section: <span className="underline underline-offset-8">{section.name}</span>
        </h2>
        <div ref={previewRef} className="mt-10 aspect-[16/9] w-full max-w-3xl overflow-hidden bg-blue-900">
          <video
            aria-label={`${section.name} preview video`}
            className="h-full w-full object-cover brightness-75 transition duration-700 ease-out group-hover:scale-110 group-hover:brightness-100"
            loop
            muted
            playsInline
            preload="metadata"
            src={section.heroVideo}
          />
        </div>
      </Link>

      {transitionRect ? (
        <TransitionPreview
          isFullScreen={isTransitionFullScreen}
          section={section}
          transitionRect={transitionRect}
        />
      ) : null}
    </section>
  );
}

// TransitionPreview renders the measured preview as a fixed still layer that grows to cover the viewport.
function TransitionPreview({
  isFullScreen,
  section,
  transitionRect,
}: {
  isFullScreen: boolean;
  section: TeamSection;
  transitionRect: TransitionRect;
}) {
  const transitionStyle: CSSProperties = isFullScreen
    ? {
        height: "100vh",
        left: 0,
        top: 0,
        width: "100vw",
      }
    : {
        height: transitionRect.height,
        left: transitionRect.left,
        top: transitionRect.top,
        width: transitionRect.width,
      };

  return (
    <div
      aria-hidden="true"
      className="fixed z-[80] overflow-hidden bg-blue-900 transition-all duration-700 ease-in-out"
      style={transitionStyle}
    >
      <video
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        src={section.heroVideo}
      />
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}

// StaticSectionBackground groups the section content on a navbar-inspired vertical gradient.
function StaticSectionBackground({ children, className }: InteractiveBackgroundProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#001f49_100%)] ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ParticleText animates description words from subtle particles into readable text.
function ParticleText({ text }: { text: string }) {
  const particles = useMemo(() => splitTextIntoWordParticles(text), [text]);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Watches the description paragraph and starts the particle animation only once it scrolls into view.
  useEffect(() => {
    const element = textRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <p
      ref={textRef}
      className="max-w-3xl text-b2 leading-relaxed text-blue-50 sm:text-b1"
      aria-label={text}
    >
      {particles.map((particle, index) => (
        <span
          aria-hidden="true"
          className={`section-description-particle inline-block whitespace-nowrap ${
            isVisible ? "section-description-particle-visible" : ""
          }`}
          key={`${particle.word}-${index}`}
          style={getParticleStyle(index, particle.seed)}
        >
          {particle.word}
          {index < particles.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </p>
  );
}

// splitTextIntoWordParticles prepares deterministic particle seeds for each word.
function splitTextIntoWordParticles(text: string) {
  return text.trim().split(/\s+/).map((word, index) => ({
    word,
    seed: pseudoRandom(index + word.charCodeAt(0)),
  }));
}

// getParticleStyle maps a particle seed into CSS variables for its entry animation.
function getParticleStyle(index: number, seed: number) {
  const x = Math.round((seed - 0.5) * 22);
  const y = Math.round((pseudoRandom(index + 17) - 0.5) * 18);
  const delay = Math.min(index * 5, 420);

  return {
    "--particle-delay": `${delay}ms`,
    "--particle-x": `${x}px`,
    "--particle-y": `${y}px`,
  } as CSSProperties;
}

// pseudoRandom creates stable animation scatter values without storing them in data.
function pseudoRandom(input: number) {
  const value = Math.sin(input * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

// clamp keeps scroll-derived values inside the expected animation range.
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
