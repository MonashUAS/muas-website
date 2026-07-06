const HIGHLIGHT_PARAM = "highlight";

export function appendHighlightParam(href: string, query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return href;
  }

  const [pathAndQuery, hash = ""] = href.split("#");
  const [path, existingQuery = ""] = pathAndQuery.split("?");
  const highlightValue = `${HIGHLIGHT_PARAM}=${encodeURIComponent(trimmedQuery)}`;
  const nextQuery = existingQuery
    ? `${existingQuery}&${highlightValue}`
    : highlightValue;

  return hash
    ? `${path}?${nextQuery}#${hash}`
    : `${path}?${nextQuery}`;
}

export function readHighlightQuery(searchParams: URLSearchParams) {
  return searchParams.get(HIGHLIGHT_PARAM)?.trim() ?? "";
}

export function stripHighlightParam(searchParams: URLSearchParams) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.delete(HIGHLIGHT_PARAM);

  const query = nextParams.toString();
  return query ? `?${query}` : "";
}
