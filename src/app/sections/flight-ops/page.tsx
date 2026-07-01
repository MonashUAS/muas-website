import { SectionPage } from "../section-page";
import { getSectionBySlug } from "../section-data";

// FlightOpsPage renders the shared section layout with flight operations content.
export default function FlightOpsPage() {
  return <SectionPage section={getSectionBySlug("flight-ops")} />;
}
