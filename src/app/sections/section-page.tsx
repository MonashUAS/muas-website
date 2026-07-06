import { notFound } from "next/navigation";
import { SectionExperience } from "./section-experience";
import type { TeamSection } from "./section-data";
import { getNextSection } from "./section-data";

type SectionPageProps = {
  section: TeamSection | undefined;
};

// SectionPage renders the complete reusable page layout for a MUAS team section.
export function SectionPage({ section }: SectionPageProps) {
  if (!section) {
    notFound();
  }

  const nextSection = getNextSection(section.slug);

  if (!nextSection) {
    notFound();
  }

  return <SectionExperience nextSection={nextSection} section={section} />;
}
