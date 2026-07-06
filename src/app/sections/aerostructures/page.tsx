import { SectionPage } from "../section-page";
import { getSectionBySlug } from "../section-data";

// AerostructuresPage renders the shared section layout with aerostructures content.
export default function AerostructuresPage() {
  return <SectionPage section={getSectionBySlug("aerostructures")} />;
}
