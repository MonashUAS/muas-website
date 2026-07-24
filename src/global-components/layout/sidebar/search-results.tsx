import { useSearchNavigation } from "@/global-components/search/search-navigation-provider";
import type { SearchResultGroup } from "@/lib/search/matches";

type SearchResultsProps = {
  results: SearchResultGroup[];
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
            className="search-result-snippet-highlight"
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
  const { navigateToSearchDestination } = useSearchNavigation();

  if (results.length === 0) {
    return (
      <p
        className="text-[clamp(1.1rem,2vw,1.45rem)] font-medium text-white/58"
        aria-live="polite"
      >
        No results found.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {results.map((group) => (
        <section
          key={group.route}
          aria-labelledby={`search-group-${group.route.replace(/\W+/g, "-")}`}
        >
          <h2
            id={`search-group-${group.route.replace(/\W+/g, "-")}`}
            className="text-[clamp(1.3rem,2.4vw,1.9rem)] font-medium leading-tight text-white"
          >
            {group.pageTitle}
          </h2>

          <ul className="mt-3 divide-y divide-white/10">
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    closeOverlay();
                    navigateToSearchDestination(item.destination);
                  }}
                  aria-label={`${group.pageTitle}, ${item.label}: ${item.snippet}`}
                  className="group flex w-full flex-col gap-2 py-4 text-left transition-[color,transform] duration-300 hover:translate-x-1 focus-visible:translate-x-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 sm:py-5 motion-reduce:transition-none"
                >
                  <span className="text-b1 font-medium leading-tight text-white/82 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                    {item.label}
                  </span>
                  <span className="max-w-[760px] text-b1 leading-relaxed text-white/58 transition-colors duration-300 group-hover:text-white/74 group-focus-visible:text-white/74">
                    <HighlightedText text={item.snippet} query={item.query} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
