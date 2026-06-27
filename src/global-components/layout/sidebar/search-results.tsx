import Link from "next/link";
import type { SearchResult } from "@/lib/search-registry";

export type SearchResultWithSnippet = {
  result: SearchResult;
  snippet: string;
};

type SearchResultsProps = {
  results: SearchResultWithSnippet[];
  closeOverlay: () => void;
};

// Search results display readable descriptions, not raw keyword or route data.
export function SearchResults({ results, closeOverlay }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <p className="text-[clamp(1.1rem,2vw,1.45rem)] font-medium text-white/58">
        No results found.
      </p>
    );
  }

  return (
    <div className="divide-y divide-white/10">
      {results.map(({ result, snippet }) => (
        <Link
          key={`${result.url}-${result.title}`}
          href={result.url}
          onClick={closeOverlay}
          className="group flex flex-col gap-2 py-5 text-left transition-[color,transform] duration-300 hover:translate-x-1 focus-visible:translate-x-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 sm:py-6 motion-reduce:transition-none"
        >
          <span className="text-caption uppercase tracking-[0.18em] text-blue-100/48 transition-colors duration-300 group-hover:text-blue-100/68 group-focus-visible:text-blue-100/68">
            {result.category}
          </span>
          <span className="text-[clamp(1.2rem,2.2vw,1.7rem)] font-medium leading-tight text-white/84 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
            {result.title}
          </span>
          <span className="max-w-[760px] text-b1 leading-relaxed text-white/58 transition-colors duration-300 group-hover:text-white/74 group-focus-visible:text-white/74">
            {snippet}
          </span>
        </Link>
      ))}
    </div>
  );
}
