import { NextDestinationLink } from "@/global-components/next-destination-link";

const teamHref = "/suas-2026-team";
const teamImage = "/images/homepage/quick-nav/our-team.jpg";

// TeamLink previews the Redback team page using the shared next-destination panel.
export function TeamLink() {
  return (
    <NextDestinationLink
      id="redback-team-link"
      description="Learn about the people behind Redback and key design decisions made along the way towards SUAS 2026."
      href={teamHref}
      imageAlt="MUAS team group portrait"
      imageSrc={teamImage}
      title="Next: The Redback Team"
    />
  );
}
