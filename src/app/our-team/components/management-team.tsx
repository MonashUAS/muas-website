"use client";

import { useEffect, useRef, useState } from "react";
import { teamSections } from "../data/team-data";
import { MemberCard } from "./member-card";

export function ManagementTeam() {
  const [activeSectionId, setActiveSectionId] = useState("all");
  const [displayedSectionId, setDisplayedSectionId] = useState("all");
  const [isDissolving, setIsDissolving] = useState(false);
  const transitionTimer = useRef<number | null>(null);

  const displayedSection =
    teamSections.find((section) => section.id === displayedSectionId) ??
    teamSections[0];

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  const changeSection = (sectionId: string) => {
    if (sectionId === activeSectionId) {
      return;
    }

    setActiveSectionId(sectionId);
    setIsDissolving(true);

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }

    transitionTimer.current = window.setTimeout(() => {
      setDisplayedSectionId(sectionId);

      window.requestAnimationFrame(() => {
        setIsDissolving(false);
      });
    }, 180);
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

        <div
          className={`transition-all duration-200 ease-out motion-reduce:transition-none ${
            isDissolving
              ? "translate-y-1 opacity-0 blur-[3px]"
              : "translate-y-0 opacity-100 blur-0"
          }`}
        >
          <p className="mx-auto mt-8 max-w-5xl text-center text-b2 leading-relaxed text-blue-50 sm:text-b1">
            {displayedSection.description}
          </p>

          <div className="mx-auto mt-10 flex max-w-[1280px] flex-wrap justify-center gap-7">
            {displayedSection.members.map((member) => (
              <MemberCard
                key={`${displayedSection.id}-${member.name}`}
                member={member}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
