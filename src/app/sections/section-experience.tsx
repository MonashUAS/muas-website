"use client";

import Image from "next/image";
import Link from "next/link";
import { ProjectCarousel } from "@/app/sections/project-carousel";
import type { SectionLead, TeamSection } from "./section-data";

type SectionExperienceProps = {
  nextSection: TeamSection;
  section: TeamSection;
};

// SectionExperience renders the complete shared page layout for each MUAS team section.
export function SectionExperience({ nextSection, section }: SectionExperienceProps) {
  return (
    <div className="min-h-full bg-background text-white">
      <SectionHero section={section} />
      <main className="relative z-10">
        <Projects section={section} />
        <NextSection section={nextSection} />
      </main>
    </div>
  );
}

// SectionHero introduces each team section with full-bleed media and lead profiles.
function SectionHero({ section }: { section: TeamSection }) {
  const heroTitleClassName = getHeroTitleClassName(section.name);

  return (
    <section className="relative isolate flex viewport-fold scroll-mt-20 items-end overflow-hidden bg-black-500 text-white">
      <video
        aria-label={`${section.name} hero video`}
        autoPlay
        className="absolute inset-0 -z-30 h-full w-full object-cover"
        loop
        muted
        playsInline
        src={section.heroVideo}
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,31,73,0.52)_48%,rgba(0,0,0,0.58)_100%),linear-gradient(180deg,rgba(2,4,10,0.2)_0%,rgba(2,4,10,0.74)_100%)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_16%_10%,rgba(84,134,200,0.22),transparent_30%),radial-gradient(circle_at_84%_56%,rgba(0,74,173,0.18),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:84px_84px] opacity-20" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(0deg,#02040a_0%,rgba(2,4,10,0)_100%)]" />

      <div className="mx-auto grid w-full max-w-[1720px] gap-10 px-5 pb-14 pt-12 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.48fr)] lg:items-end lg:gap-8 lg:px-12 lg:pb-20">
        <div className="min-w-0">
          <h1 className={heroTitleClassName}>
            {section.name}
          </h1>

          <p className="mt-6 max-w-3xl text-b1 leading-relaxed text-blue-50 sm:text-subtitle">
            {section.description}
          </p>
        </div>

        <div className="w-full border-t border-white/24 pt-6 lg:mb-2">
          <h2 className="text-h7 font-medium uppercase leading-none text-white sm:text-h6">
            {section.leads.length === 1 ? "Section Lead" : "Section Leads"}
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:flex sm:flex-wrap lg:grid lg:grid-cols-2">
            {section.leads.map((lead) => (
              <LeadProfile key={lead.name} lead={lead} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// getHeroTitleClassName keeps long section names on one line without viewport-scaled type.
function getHeroTitleClassName(sectionName: string) {
  const compactTitle = sectionName.replace(/\s+/g, "").length > 12;
  const sizeClassName = compactTitle
    ? "text-h6 sm:text-h4 lg:text-h2"
    : "text-h4 sm:text-h2 lg:text-h1";

  return `max-w-none whitespace-nowrap font-medium uppercase leading-[0.92] text-white ${sizeClassName}`;
}

// LeadProfile renders a single section lead headshot and name.
function LeadProfile({ lead }: { lead: SectionLead }) {
  return (
    <figure className="min-w-0 text-left">
      <Image
        alt={lead.name}
        className="aspect-square w-full max-w-32 rounded-full border border-white/20 object-cover shadow-[0_18px_42px_rgba(0,0,0,0.34)] sm:max-w-36"
        height={144}
        src={lead.image}
        width={144}
      />
      <figcaption className="mt-4 break-words text-b1 font-medium leading-tight text-white sm:text-subtitle">
        {lead.name}
      </figcaption>
    </figure>
  );
}

// Projects renders the section project carousel on the shared MUAS page background.
function Projects({ section }: { section: TeamSection }) {
  return (
    <section
      id="team-projects"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[linear-gradient(180deg,#02040a_0%,#001126_46%,#001f49_100%)] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_18%,rgba(84,134,200,0.18),transparent_30%),radial-gradient(circle_at_84%_68%,rgba(0,74,173,0.2),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:86px_86px] opacity-24" />

      <div className="mx-auto w-full max-w-[1720px]">
        <div className="max-w-4xl">
          <h2 className="text-h5 font-medium uppercase leading-[0.96] text-white sm:text-h3">
            Projects
          </h2>
          <p className="mt-4 max-w-3xl text-b1 leading-relaxed text-blue-50/76 sm:text-subtitle">
            Current work inside the {section.name} section.
          </p>
        </div>

        <ProjectCarousel projects={section.projects} />
      </div>
    </section>
  );
}

// NextSection renders the linked preview card; shared dissolve handles the route swap.
function NextSection({ section }: { section: TeamSection }) {
  return (
    <section className="relative z-10 overflow-hidden bg-[linear-gradient(155deg,#001f49_0%,#02040a_48%,#05080d_100%)] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(84,134,200,0.16),transparent_32%)]" />
      <Link
        aria-label={`Learn about ${section.name}`}
        className="group relative mx-auto grid w-full max-w-[1720px] gap-8 outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(420px,0.7fr)] lg:items-center"
        href={`/sections/${section.slug}`}
      >
        <div>
          <p className="text-caption font-medium uppercase tracking-[0.2em] text-blue-100/62">
            Next Section
          </p>
          <h2 className="mt-4 max-w-4xl text-h5 font-medium uppercase leading-[0.96] text-white sm:text-h3">
            {section.name}
          </h2>
          <p className="mt-5 max-w-3xl text-b1 leading-relaxed text-blue-50/74 sm:text-subtitle">
            {section.shortDescription}
          </p>
        </div>

        <div className="aspect-[16/9] w-full overflow-hidden border border-blue-200/25 bg-blue-900 shadow-[0_32px_90px_rgba(0,0,0,0.36)] [clip-path:polygon(7%_0,100%_0,100%_100%,0_100%)]">
          <Image
            alt={`${section.name} project preview`}
            className="h-full w-full object-cover brightness-75 transition duration-700 ease-out group-hover:scale-110 group-hover:brightness-100"
            height={720}
            src={section.projects[0]?.image ?? "/images/homepage/flight-day.jpg"}
            width={1280}
          />
        </div>
      </Link>
    </section>
  );
}
