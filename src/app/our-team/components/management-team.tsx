"use client";

import { useEffect, useRef, useState } from "react";
import type { TeamMember, TeamSection } from "../data/team-data";
import { teamSections } from "../data/team-data";
import { MemberCard } from "./member-card";

const dissolveMs = 180;

function preloadMemberImages(members: TeamMember[]) {
  return Promise.all(
    members.map(
      (member) =>
        new Promise<void>((resolve) => {
          const image = new window.Image();
          image.decoding = "async";
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = member.image.src;

          if (image.complete) {
            resolve();
          }
        }),
    ),
  );
}

export function ManagementTeam() {
  const [activeSectionId, setActiveSectionId] = useState("all");
  const [displayedSectionId, setDisplayedSectionId] = useState("all");
  const [isDissolving, setIsDissolving] = useState(false);
  const transitionTimer = useRef<number | null>(null);
  const preloadGeneration = useRef(0);

  const displayedSection =
    teamSections.find((section) => section.id === displayedSectionId) ??
    teamSections[0];

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }

      preloadGeneration.current += 1;
    };
  }, []);

  const changeSection = (sectionId: string) => {
    if (sectionId === activeSectionId || isDissolving) {
      return;
    }

    const nextSection =
      teamSections.find((section) => section.id === sectionId) ??
      teamSections[0];

    setActiveSectionId(sectionId);
    setIsDissolving(true);

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }

    const generation = ++preloadGeneration.current;

    const minimumDissolve = new Promise<void>((resolve) => {
      transitionTimer.current = window.setTimeout(resolve, dissolveMs);
    });

    void Promise.all([
      preloadMemberImages(nextSection.members),
      minimumDissolve,
    ]).then(() => {
      if (generation !== preloadGeneration.current) {
        return;
      }

      setDisplayedSectionId(sectionId);

      window.requestAnimationFrame(() => {
        if (generation !== preloadGeneration.current) {
          return;
        }

        setIsDissolving(false);
      });
    });
  };

  return (
    <section
      id="management-team"
      className="relative scroll-mt-20 border-t border-white/10 py-16 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          <h2 className="text-h6 font-black leading-tight tracking-[-0.05em] text-white sm:text-h5">
            The 2026 Management Team
          </h2>

          <p className="mt-3 text-b2 font-medium text-blue-100 sm:text-b1">
            Explore the people leading each part of Monash UAS.
          </p>
        </div>

        <nav
          aria-label="Filter management team members"
          className="mx-auto mt-8 flex max-w-max gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-md sm:gap-3"
        >
          {teamSections.map((section) => {
            const isActive = activeSectionId === section.id;

            return (
              <button
                key={section.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => changeSection(section.id)}
                className={`shrink-0 rounded-full border px-5 py-2.5 text-b2 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none sm:text-b1 ${
                  isActive
                    ? "border-white bg-white text-blue-900"
                    : "border-white/20 bg-white/[0.05] text-blue-100 hover:bg-white/[0.1] hover:text-white"
                }`}
              >
                {section.label}
              </button>
            );
          })}
        </nav>

        <TeamSectionPanel
          isDissolving={isDissolving}
          section={displayedSection}
        />
      </div>
    </section>
  );
}

function TeamSectionPanel({
  isDissolving,
  section,
}: {
  isDissolving: boolean;
  section: TeamSection;
}) {
  return (
    <div
      className={`transition-all duration-200 ease-out motion-reduce:transition-none ${
        isDissolving
          ? "translate-y-1 opacity-0 blur-[3px]"
          : "translate-y-0 opacity-100 blur-0"
      }`}
    >
      <p className="mx-auto mt-8 max-w-5xl text-center text-b2 leading-relaxed text-blue-50 sm:text-b1">
        {section.description}
      </p>

      <div className="mx-auto mt-10 flex max-w-[1280px] flex-wrap justify-center gap-7">
        {section.members.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}
