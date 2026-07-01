import { SectionPage } from "../section-page";
import { getSectionBySlug } from "../section-data";

// PropulsionPage renders the shared section layout with propulsion content.
export default function PropulsionPage() {
  return <SectionPage section={getSectionBySlug("propulsion")} />;
}
