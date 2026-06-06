import { useMemo } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { searchRegistry } from "@/lib/search-registry";

// Defines what data and functions this search box needs from the sidebar
interface SidebarSearchProps {
  isExpanded: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExpand: () => void;
}

export function SidebarSearch({ isExpanded, searchQuery, setSearchQuery, onExpand }: SidebarSearchProps) {
  // Filters the search registry based on what the user types
  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return []; // If search is empty, show nothing

    return searchRegistry
      .filter((item) => {
        // Checks if the user's text matches the title or category
        const searchableText = `${item.title} ${item.category}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
      .slice(0, 8); // Limits the preview to a maximum of 8 results
  }, [searchQuery]); // Re-runs only when the search query text changes

  return (
    <div className="relative">
      {/* Search Input Container: opens up when you hover over it */}
      <div
        className={`flex h-10 items-center border border-blue-500 bg-black-500/80 ${
          isExpanded ? "gap-3 px-4" : "justify-center px-0"
        }`}
        onMouseEnter={onExpand}
      >
        <Search aria-hidden className="size-5 shrink-0 text-white" />
        
        {/* Only displays the input text box if the sidebar is open/expanded */}
        {isExpanded && (
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="min-w-0 flex-1 bg-transparent text-b1 text-white outline-none placeholder:text-blue-100"
          />
        )}
      </div>

      {/* Dropdown Menu: Only mounts/shows if sidebar is open and matches are found */}
      {isExpanded && searchResults.length > 0 && (
        <div className="absolute left-0 right-0 top-12 z-10 max-h-72 overflow-y-auto border border-blue-500 bg-black-500/95 shadow-xl">
          {searchResults.map((result) => (
            <Link
              key={result.url}
              href={result.url}
              className="block px-4 py-3 hover:bg-blue-900"
              onClick={() => setSearchQuery("")} // Clears search text when a link is clicked
            >
              <span className="block text-b2 text-white">{result.title}</span>
              <span className="block text-caption text-blue-100">{result.category}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}