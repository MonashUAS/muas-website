import { NextDestinationLink } from "@/global-components/next-destination-link";

// TeamLink previews the Redback team page using the shared next-destination panel.
export function TeamLink() {
  return (
    <NextDestinationLink
      id="redback-team-link"
      href="/suas-2026-team"
      title="Next: The Redback Team"
      description="Learn about the people behind Redback and key design decisions made along the way towards SUAS 2026."
      imageSrc="/images/homepage/full-team-photo.jpg"
      imageAlt="MUAS team group portrait"
    />
  );
}
