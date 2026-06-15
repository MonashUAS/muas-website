import { ScrollHero } from "./ScrollHero";
import { KeyFeatures } from "./KeyFeatures";
import { Video } from "./Video";
import { TechSpecs } from "./TechSpecs";
import { TeamLink } from "./TeamLink";

// SUAS2026HomePage composes the full public-facing Redback home page.
export default function SUAS2026HomePage() {
  return (
    <div className="bg-black-500">
      <ScrollHero />
      <Video />
      <KeyFeatures />
      <TechSpecs />
      <TeamLink />
    </div>
  );
}
