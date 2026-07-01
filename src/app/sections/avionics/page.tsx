import { SectionPage } from "../section-page";
import { getSectionBySlug } from "../section-data";

// AvionicsPage renders the shared section layout with avionics content.
export default function AvionicsPage() {
  return <SectionPage section={getSectionBySlug("avionics")} />;
}
