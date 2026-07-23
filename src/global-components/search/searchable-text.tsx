"use client";

import {
  createElement,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";
import {
  useSearchNavigation,
  type SearchRangeHighlightRequest,
} from "./search-navigation-provider";

type SearchableTextElement =
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "dt"
  | "dd"
  | "button";

type SearchableTextProps = HTMLAttributes<HTMLElement> & {
  as?: SearchableTextElement;
  searchId: string;
  children: string;
};

type ActiveRange = {
  start: number;
  end: number;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isVisibleSearchElement(element: HTMLElement) {
  return (
    element.getClientRects().length > 0 &&
    element.closest("[aria-hidden='true']") === null
  );
}

function getQueryRange(text: string, query: string) {
  const match = new RegExp(escapeRegExp(query), "i").exec(text);

  return match
    ? {
        start: match.index,
        end: match.index + match[0].length,
      }
    : null;
}

function getRequestRange(
  text: string,
  request: SearchRangeHighlightRequest,
): ActiveRange | null {
  if (
    request.range &&
    request.sourceText === text &&
    request.range.start >= 0 &&
    request.range.end <= text.length &&
    request.range.start < request.range.end
  ) {
    return request.range;
  }

  return getQueryRange(text, request.query);
}

function renderHighlightedText(
  text: string,
  range: ActiveRange | null,
  isFading: boolean,
) {
  if (!range) {
    return text;
  }

  return (
    <>
      {text.slice(0, range.start)}
      <mark
        className={`search-text-range-highlight ${
          isFading ? "search-text-range-highlight-fading" : ""
        }`}
      >
        {text.slice(range.start, range.end)}
      </mark>
      {text.slice(range.end)}
    </>
  );
}

export function SearchableText({
  as = "span",
  searchId,
  children,
  className,
  ...props
}: SearchableTextProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [activeRange, setActiveRange] = useState<ActiveRange | null>(null);
  const [isFading, setIsFading] = useState(false);
  const { registerSearchTarget } = useSearchNavigation();
  const Tag = as;

  const canHighlightQuery = useMemo(() => {
    return activeRange !== null;
  }, [activeRange]);

  useEffect(() => {
    if (!element) {
      return;
    }

    return registerSearchTarget(searchId, {
      element,
      highlightMode: "text",
      isReady: () => isVisibleSearchElement(element),
      applyRangeHighlight: (request) => {
        const range = getRequestRange(children, request);

        if (!range) {
          return false;
        }

        setActiveRange(range);
        setIsFading(false);
        return true;
      },
      applyTextHighlight: (query) => {
        const range = getQueryRange(children, query);

        if (!range) {
          return false;
        }

        setActiveRange(range);
        setIsFading(false);
        return true;
      },
      fadeTextHighlight: () => setIsFading(true),
      clearTextHighlight: () => {
        setActiveRange(null);
        setIsFading(false);
      },
    });
  }, [children, element, registerSearchTarget, searchId]);

  return (
    createElement(
      Tag,
      {
        ...props,
        ref: setElement,
        "data-search-target-id": searchId,
        "data-search-managed": "true",
        "data-search-highlight-mode": "text",
      className,
      },
      canHighlightQuery
        ? renderHighlightedText(children, activeRange, isFading)
        : children,
    )
  );
}
