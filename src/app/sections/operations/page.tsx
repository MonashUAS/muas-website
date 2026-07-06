import { SectionPage } from "../section-page";
import { getSectionBySlug } from "../section-data";

// OperationsPage renders the shared section layout with operations content.
export default function OperationsPage() {
  return <SectionPage section={getSectionBySlug("operations")} />;
}
