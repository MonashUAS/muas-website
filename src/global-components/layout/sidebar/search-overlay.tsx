import { Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchRegistry } from "@/lib/search-registry";
import type { SearchResult } from "@/lib/search-registry";
import { overlayContentClass, overlayInnerClass } from "./navbar-classes";
import { SearchResults } from "./search-results";

type SearchOverlayProps = {
  searchId: string;
  closeOverlay: () => void;
};

// Selects readable result copy instead of exposing raw matched fields.
function getSearchSnippet(result: SearchResult) {
  return result.description;
}

// Owns search-specific state while Sidebar owns the shared overlay mode.
export function SearchOverlay({ searchId, closeOverlay }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  useEffect(() => {
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  const searchResultsWithMatches = useMemo(() => {
    // Hide results until typing so the overlay does not read as a sitemap.
    if (!normalizedSearchQuery) {
      return [];
    }

    return searchRegistry
      .filter((result) => {
        const searchableText = [
          result.title,
          result.category,
          result.description,
          ...(result.keywords ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedSearchQuery);
      })
      .map((result) => ({
        result,
        snippet: getSearchSnippet(result),
      }));
  }, [normalizedSearchQuery]);

  return (
    <section id={searchId} className={overlayContentClass}>
      <div className={overlayInnerClass}>
        <label htmlFor={`${searchId}-input`} className="sr-only">
          Search
        </label>

        <div className="flex items-center gap-4 border-b border-white/18 pb-4 transition-colors duration-300 focus-within:border-blue-100/55 motion-reduce:transition-none">
          <Search
            aria-hidden
            className="h-8 w-8 shrink-0 text-blue-100/62 sm:h-10 sm:w-10"
          />

          <input
            ref={searchInputRef}
            id={`${searchId}-input`}
            type="text"
            inputMode="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-[clamp(2.3rem,8vw,5rem)] font-medium leading-none text-white placeholder:text-white/32 focus:outline-none"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                searchInputRef.current?.focus();
              }}
              className="shrink-0 rounded-full px-3 py-2 text-b2 uppercase tracking-[0.16em] text-white/62 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none"
            >
              Clear
            </button>
          ) : null}
        </div>

        {normalizedSearchQuery ? (
          <div className="mt-9 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none">
            <SearchResults
              results={searchResultsWithMatches}
              closeOverlay={closeOverlay}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
