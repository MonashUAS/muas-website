import { getGroupedSearchResults } from "./matches";
import type { SearchDestination, SearchDocument } from "./types";

type SearchValidationCheck = {
  name: string;
  passed: boolean;
  message: string;
};

function findDestination(
  documents: SearchDocument[],
  query: string,
  predicate: (destination: SearchDestination) => boolean,
) {
  return getGroupedSearchResults(documents, query)
    .flatMap((group) => group.items)
    .map((item) => item.destination)
    .find(predicate);
}

function textTargetCheck(
  documents: SearchDocument[],
  query: string,
  highlightTargetId: string,
): SearchValidationCheck {
  const destination = findDestination(
    documents,
    query,
    (item) =>
      item.targetType === "text" &&
      item.textTargetId === highlightTargetId &&
      Boolean(item.matchRange),
  );

  return {
    name: `text:${highlightTargetId}`,
    passed: Boolean(destination),
    message: `${query} should resolve to text target ${highlightTargetId}.`,
  };
}

function componentTargetCheck(
  documents: SearchDocument[],
  query: string,
): SearchValidationCheck {
  const destination = findDestination(
    documents,
    query,
    (item) => item.content?.targetType === "component",
  );

  return {
    name: `component:${query}`,
    passed: Boolean(destination),
    message: `${query} should retain component-level result metadata.`,
  };
}

export function getSearchValidationReport(documents: SearchDocument[]) {
  return [
    textTargetCheck(documents, "Explore Our Sections", "homepage-sections-heading"),
    textTargetCheck(
      documents,
      "From operations to propulsion",
      "homepage-sections-description",
    ),
    textTargetCheck(
      documents,
      "demonstrating",
      "our-mission-humanitarian-potential",
    ),
    textTargetCheck(documents, "Our Mission", "our-mission-heading"),
    textTargetCheck(documents, "potential", "footer-humanitarian-potential"),
    componentTargetCheck(documents, "Meet the students behind MUAS"),
  ];
}

export function validateSearchDocuments(documents: SearchDocument[]) {
  const failedChecks = getSearchValidationReport(documents).filter(
    (check) => !check.passed,
  );

  if (failedChecks.length === 0) {
    return;
  }

  console.warn(
    "Search validation warnings:",
    failedChecks.map((check) => `${check.name}: ${check.message}`),
  );
}
