import Link from "next/link";
import { appendHighlightParam } from "@/lib/search-highlight-url";

export type SearchMatch = {
  title: string;
  category: string;
  href: string;
  snippet: string;
  query: string;
  sectionLabel: string;
};

type SearchResultsProps = {
  results: SearchMatch[];
  closeOverlay: () => void;
};

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) {
    return text;
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();

        if (!isMatch) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-blue-100/18 px-0.5 text-white"
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}

// Search results show page titles and content snippets from the matched section.
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
      {results.map(({ title, category, href, snippet, query, sectionLabel }) => (
        <Link
          key={`${href}-${sectionLabel}-${snippet}`}
          href={appendHighlightParam(href, query)}
          onClick={closeOverlay}
          aria-label={`${title}, ${sectionLabel}: ${snippet}`}
          className="group flex flex-col gap-2 py-5 text-left transition-[color,transform] duration-300 hover:translate-x-1 focus-visible:translate-x-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 sm:py-6 motion-reduce:transition-none"
        >
          <span className="text-caption uppercase tracking-[0.18em] text-blue-100/48 transition-colors duration-300 group-hover:text-blue-100/68 group-focus-visible:text-blue-100/68">
            {category}
          </span>
          <span className="text-[clamp(1.2rem,2.2vw,1.7rem)] font-medium leading-tight text-white/84 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
            {title}
          </span>
          <span className="max-w-[760px] text-b1 leading-relaxed text-white/58 transition-colors duration-300 group-hover:text-white/74 group-focus-visible:text-white/74">
            <HighlightedText text={snippet} query={query} />
          </span>
        </Link>
      ))}
    </div>
  );
}
