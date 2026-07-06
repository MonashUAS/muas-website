function findWordStart(text: string, index: number) {
  let start = index;

  while (start > 0 && /\S/.test(text[start - 1] ?? "")) {
    start -= 1;
  }

  return start;
}

function findWordEnd(text: string, index: number) {
  let end = index;

  while (end < text.length && /\S/.test(text[end] ?? "")) {
    end += 1;
  }

  return end;
}

// Extracts a readable snippet around the matched query for search result cards.
export function extractSearchSnippet(
  text: string,
  query: string,
  maxLength = 140,
): string {
  const trimmedText = text.trim();

  if (!trimmedText) {
    return "";
  }

  if (!query.trim()) {
    return trimmedText.length <= maxLength
      ? trimmedText
      : `${trimmedText.slice(0, maxLength - 1).trimEnd()}…`;
  }

  const normalizedText = trimmedText.toLowerCase();
  const normalizedQuery = query.trim().toLowerCase();
  const matchIndex = normalizedText.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return trimmedText.length <= maxLength
      ? trimmedText
      : `${trimmedText.slice(0, maxLength - 1).trimEnd()}…`;
  }

  if (trimmedText.length <= maxLength) {
    return trimmedText;
  }

  const matchEnd = matchIndex + normalizedQuery.length;
  const padding = Math.floor((maxLength - normalizedQuery.length) / 2);
  let start = Math.max(0, matchIndex - padding);
  let end = Math.min(trimmedText.length, matchEnd + padding);

  if (end - start > maxLength) {
    end = start + maxLength;
  }

  start = findWordStart(trimmedText, start);
  end = findWordEnd(trimmedText, end);

  if (end - start > maxLength) {
    end = start + maxLength;
    end = findWordEnd(trimmedText, end);
  }

  let snippet = trimmedText.slice(start, end).trim();
  const prefix = start > 0 ? "…" : "";
  const suffix = end < trimmedText.length ? "…" : "";

  if (prefix || suffix) {
    const availableLength = maxLength - prefix.length - suffix.length;

    if (snippet.length > availableLength) {
      snippet = snippet.slice(0, availableLength).trimEnd();
    }
  }

  return `${prefix}${snippet}${suffix}`;
}
