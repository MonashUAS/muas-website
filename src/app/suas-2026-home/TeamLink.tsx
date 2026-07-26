import { NextDestinationLink } from "@/global-components/next-destination-link";

const teamHref = "/suas-2026-team";
const teamImage =
  "/images/suas initiative page/next component/next section- the redback team_updated.webp";

// TeamLink previews the Redback team page using the shared next-destination panel.
export function TeamLink() {
  return (
    <NextDestinationLink
      id="redback-team-link"
      description="Learn about the people behind Redback and key design decisions made along the way towards SUAS 2026."
      href={teamHref}
      imageAlt="The Redback team gathered outdoors with the aircraft"
      imageSrc={teamImage}
      imagePosition="50% 40%"
      title="Next: The Redback Team"
    />
  );
}
