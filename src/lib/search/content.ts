import type { SearchHighlightMode, SearchTextContent } from "./types";

type TextSearchContentOptions = {
  id: string;
  text: string;
  componentTargetId?: string;
  highlightTargetId: string;
  keywords?: string[];
  highlightMode?: SearchHighlightMode;
};

export function textSearchContent({
  id,
  text,
  componentTargetId,
  highlightTargetId,
  keywords,
  highlightMode = "text",
}: TextSearchContentOptions): SearchTextContent {
  return {
    id,
    text,
    componentTargetId,
    highlightTargetId,
    keywords,
    highlightMode,
    targetType: "text",
  };
}

export function componentSearchContent(
  id: string,
  text: string,
  keywords?: string[],
): SearchTextContent {
  return {
    id,
    text,
    keywords,
    highlightMode: "component",
    targetType: "component",
  };
}

export function searchSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
