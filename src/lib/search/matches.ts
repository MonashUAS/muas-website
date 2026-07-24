import { extractSearchSnippet } from "@/lib/search-snippet";
import type {
  SearchContent,
  SearchDestination,
  SearchDocument,
  SearchMatchRange,
  SearchTextContent,
} from "./types";
import { getSearchTargetIdentity, normalizeSearchText } from "./normalize";

export type SearchResultItem = {
  id: string;
  label: string;
  snippet: string;
  query: string;
  destination: SearchDestination;
};

export type SearchResultGroup = {
  route: string;
  pageTitle: string;
  items: SearchResultItem[];
};

function toSearchTextContent(content: SearchContent, fallbackId: string) {
  return typeof content === "string"
    ? ({
        id: fallbackId,
        text: content,
        targetType: "component",
      } satisfies SearchTextContent)
    : content;
}

function getCandidateContent(
  text: SearchContent[],
  keywords: string[] | undefined,
) {
  return [
    ...text.map((content, index) =>
      toSearchTextContent(content, `content-${index}`),
    ),
    ...(keywords ?? []).map(
      (keyword, index) =>
        ({
          id: `keyword-${index}`,
          text: keyword,
          targetType: "component",
        }) satisfies SearchTextContent,
    ),
  ].filter((content) => content.text);
}

function getBestMatchContent(
  contents: SearchTextContent[],
  normalizedQuery: string,
) {
  return (
    contents.find((content) =>
      normalizeSearchText(content.text).includes(normalizedQuery),
    ) ??
    contents[0] ?? {
      id: "fallback",
      text: "",
    }
  );
}

function getNormalizedTextWithOffsets(value: string) {
  let normalized = "";
  const offsets: number[] = [];
  let lastWasSpace = true;

  for (let index = 0; index < value.length; index += 1) {
    const normalizedCharacter = value[index]
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['’]/g, "");

    if (!normalizedCharacter) {
      continue;
    }

    if (/^[a-z0-9]$/.test(normalizedCharacter)) {
      normalized += normalizedCharacter;
      offsets.push(index);
      lastWasSpace = false;
      continue;
    }

    if (!lastWasSpace) {
      normalized += " ";
      offsets.push(index);
      lastWasSpace = true;
    }
  }

  if (normalized.endsWith(" ")) {
    normalized = normalized.slice(0, -1);
    offsets.pop();
  }

  return { normalized, offsets };
}

function getMatchRange(
  text: string,
  normalizedQuery: string,
): SearchMatchRange | undefined {
  const { normalized, offsets } = getNormalizedTextWithOffsets(text);
  const start = normalized.indexOf(normalizedQuery);

  if (start < 0) {
    return undefined;
  }

  const endOffsetIndex = start + normalizedQuery.length - 1;
  const originalStart = offsets[start];
  const originalEnd = offsets[endOffsetIndex];

  if (originalStart === undefined || originalEnd === undefined) {
    return undefined;
  }

  return {
    start: originalStart,
    end: originalEnd + 1,
  };
}

function getDestinationMetadata(
  targetId: string,
  content: SearchTextContent,
  normalizedQuery: string,
) {
  const targetType = content.targetType ?? content.highlightMode ?? "component";
  const componentTargetId = content.componentTargetId ?? targetId;
  const textTargetId =
    targetType === "text" ? content.highlightTargetId ?? targetId : undefined;
  const scrollTargetId =
    targetType === "text" ? componentTargetId : content.highlightTargetId ?? targetId;
  const matchRange =
    targetType === "text" ? getMatchRange(content.text, normalizedQuery) : undefined;

  return {
    componentTargetId,
    matchRange,
    scrollTargetId,
    targetType,
    textTargetId,
  } satisfies Pick<
    SearchDestination,
    | "componentTargetId"
    | "matchRange"
    | "scrollTargetId"
    | "targetType"
    | "textTargetId"
  >;
}

export function getGroupedSearchResults(
  documents: SearchDocument[],
  query: string,
): SearchResultGroup[] {
  const displayQuery = query.trim();
  const normalizedQuery = normalizeSearchText(displayQuery);

  if (!normalizedQuery) {
    return [];
  }

  const groups = new Map<string, SearchResultGroup>();
  const seen = new Set<string>();

  for (const document of documents) {
    const pageMatches = normalizeSearchText(document.title).includes(
      normalizedQuery,
    );

    for (const target of document.targets) {
      const candidateContent = getCandidateContent(target.text, target.keywords);
      const hasTargetMatch =
        pageMatches ||
        normalizeSearchText(target.label).includes(normalizedQuery) ||
        candidateContent.some((content) =>
          normalizeSearchText(content.text).includes(normalizedQuery),
        );

      if (!hasTargetMatch) {
        continue;
      }

      const matchedContent = getBestMatchContent(
        [
          ...candidateContent,
          {
            id: "label",
            text: target.label,
            highlightTargetId: target.id,
            highlightMode: "component",
            targetType: "component",
          },
        ],
        normalizedQuery,
      );
      const destinationMetadata = getDestinationMetadata(
        target.id,
        matchedContent,
        normalizedQuery,
      );
      const destinationKey = getSearchTargetIdentity(document.route, target.id);
      const contentIdentity =
        matchedContent.id || normalizeSearchText(matchedContent.text);
      const contentKey = normalizeSearchText(
        `${target.label} ${matchedContent.text}`,
      );
      const dedupeKey = `${destinationKey}::${matchedContent.targetType ?? "component"}::${contentIdentity}::${contentKey}`;

      if (seen.has(dedupeKey)) {
        continue;
      }

      seen.add(dedupeKey);

      const group =
        groups.get(document.route) ??
        ({
          route: document.route,
          pageTitle: document.title,
          items: [],
        } satisfies SearchResultGroup);

      group.items.push({
        id: dedupeKey,
        label: target.label,
        snippet: extractSearchSnippet(matchedContent.text, displayQuery),
        query: displayQuery,
        destination: {
          route: document.route,
          pageTitle: document.title,
          target,
          content: matchedContent,
          ...destinationMetadata,
          matchQuery: displayQuery,
        },
      });
      groups.set(document.route, group);
    }
  }

  return Array.from(groups.values()).filter((group) => group.items.length > 0);
}
