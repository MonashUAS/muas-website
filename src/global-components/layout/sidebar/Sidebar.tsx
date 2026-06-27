"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { searchRegistry } from "@/lib/search-registry";
import type { SearchResult } from "@/lib/search-registry";

type OverlayMode = "menu" | "search" | null;

type NavLink = {
  href: string;
  label: string;
};

type NavNestedGroup = {
  label: string;
  links: NavLink[];
};

type NavGroup = {
  label: string;
  links: Array<NavLink | NavNestedGroup>;
};

const homeLink: NavLink = { href: "/", label: "Home" };

const navigationGroups: NavGroup[] = [
  {
    label: "Discover",
    links: [
      { href: "/our-team", label: "Our Team" },
      { href: "/our-drones", label: "Our Drones" },
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
  {
    label: "Teams",
    links: [
      { href: "/aerostructures", label: "Aerostructures" },
      { href: "/avionics", label: "Avionics" },
      { href: "/flight-ops", label: "Flight Operations" },
      { href: "/operations", label: "Operations" },
      { href: "/propulsion", label: "Propulsion" },
    ],
  },
  {
    label: "Competitions",
    links: [
      {
        label: "SUAS 2026",
        links: [
          { href: "/suas-2026-home", label: "Homepage" },
          { href: "/suas-2026-team", label: "Team" },
        ],
      },
      { href: "/nfc-2025", label: "NFC 2025" },
    ],
  },
  {
    label: "Connect",
    links: [
      { href: "/our-sponsors", label: "Sponsors" },
      { href: "/recruitment", label: "Recruitment" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
];

const topRowClass =
  "mx-auto grid h-20 w-full max-w-[1720px] grid-cols-[84px_minmax(0,1fr)_84px] items-center px-5 sm:grid-cols-[132px_minmax(0,1fr)_132px] sm:px-8 lg:px-12";

const markClass = "h-14 w-14 object-contain sm:h-16 sm:w-16";

const navButtonClass =
  "flex h-10 w-[84px] items-center justify-center rounded-full bg-white/[0.055] text-[0.65rem] uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:h-11 sm:w-[132px] sm:text-b2 sm:tracking-[0.18em] motion-reduce:transition-none";

const headingClass =
  "text-[clamp(3rem,13vw,5.35rem)] font-medium leading-[0.96] tracking-normal";

// Selects readable result copy instead of exposing raw matched fields.
function getSearchSnippet(result: SearchResult, query: string) {
  const queryText = query.toLowerCase();

  if (result.description.toLowerCase().includes(queryText)) {
    return result.description;
  }

  const keyword = result.keywords?.find((item) =>
    item.toLowerCase().includes(queryText),
  );

  if (keyword) {
    return result.description;
  }

  return result.description;
}

function BrandLink({
  isMenuOpen,
  onClick,
}: {
  isMenuOpen: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      aria-label="MUAS home"
      onClick={onClick}
      className={`group relative z-10 mx-auto flex h-14 items-center overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 motion-reduce:transition-none ${
        isMenuOpen ? "w-[148px]" : "w-14 sm:w-14"
      }`}
    >
      {/* Collapsed logo mark. */}
      <Image
        src="/logos/logo.svg"
        alt="MUAS Logo"
        width={100}
        height={100}
        className={`absolute left-0 ${markClass} transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isMenuOpen ? "-translate-x-1 opacity-0" : "translate-x-0 opacity-100"
        }`}
        priority
      />

      {/* Expanded logo lockup. */}
      <Image
        src="/logos/logo-with-text.svg"
        alt="MUAS Logo"
        width={148}
        height={54}
        aria-hidden={!isMenuOpen}
        className={`h-auto w-[148px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
        }`}
        priority
      />
    </Link>
  );
}

export default function Sidebar() {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuId = useId();
  const searchId = useId();

  const isOverlayOpen = overlayMode !== null;
  const isSearchMode = overlayMode === "search";
  const isMenuMode = overlayMode === "menu";

  const closeOverlay = useCallback(() => {
    setOverlayMode(null);
    setExpandedGroup(null);
    setSearchQuery("");
  }, []);

  // Prevent background scrolling while the menu or search overlay is open.
  useEffect(() => {
    if (!isOverlayOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOverlay, isOverlayOpen]);

  // Focus the search input as soon as search mode opens.
  useEffect(() => {
    if (overlayMode !== "search") {
      return;
    }

    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [overlayMode]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

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
        snippet: getSearchSnippet(result, normalizedSearchQuery),
      }));
  }, [normalizedSearchQuery]);

  const openMenu = () => {
    setExpandedGroup(null);
    setSearchQuery("");
    setOverlayMode("menu");
  };

  const openSearch = () => {
    setExpandedGroup(null);
    setOverlayMode("search");
  };

  return (
    <>
      {/* Fixed top navbar. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(155deg,#001f49_0%,#02040a_46%,#05080d_100%)] text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
        <nav className={topRowClass}>
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-controls={menuId}
            aria-expanded={isMenuMode}
            onClick={openMenu}
            className={`relative z-10 justify-self-start ${navButtonClass}`}
          >
            <span>Menu</span>
          </button>

          <BrandLink isMenuOpen={isOverlayOpen} />

          <button
            type="button"
            aria-label="Open site search"
            aria-controls={searchId}
            aria-expanded={isSearchMode}
            onClick={openSearch}
            className={`relative z-10 justify-self-end gap-1.5 ${navButtonClass}`}
          >
            <Search aria-hidden className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </nav>
      </header>

      {/* Shared full-screen overlay for both menu mode and search mode. */}
      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label={isSearchMode ? "Site search" : "Main navigation"}
        className={`fixed inset-0 z-[60] overflow-y-auto bg-[#02050b] text-white transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isOverlayOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Overlay background treatment. */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(155deg,#001f49_0%,#02040a_46%,#05080d_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(84,134,200,0.2),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(176,199,230,0.08),transparent_28%)]" />
          <div className="absolute inset-x-0 top-0 h-20 border-b border-white/10" />
          <div className="absolute bottom-0 left-0 h-1/2 w-full bg-[linear-gradient(0deg,rgba(0,0,0,0.46),transparent)]" />
        </div>

        <div
          className={`relative flex min-h-screen flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isOverlayOpen ? "translate-y-0" : "translate-y-4"
          }`}
        >
          {/* Overlay top row. Mirrors the closed navbar alignment. */}
          <div className={topRowClass}>
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={closeOverlay}
              className={`justify-self-start ${navButtonClass}`}
            >
              Close
            </button>

            <BrandLink isMenuOpen={isOverlayOpen} onClick={closeOverlay} />

            <button
              type="button"
              aria-label="Open site search"
              aria-controls={searchId}
              aria-expanded={isSearchMode}
              onClick={openSearch}
              className={`justify-self-end gap-1.5 ${navButtonClass}`}
            >
              <Search aria-hidden className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {isMenuMode ? (
            <nav className="mx-auto flex w-full max-w-[1720px] flex-1 px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-12 lg:py-20">
              <div className="flex w-full max-w-[940px] flex-col items-start justify-center text-left">
                {/* Home is a direct link, not a dropdown. */}
                <Link
                  href={homeLink.href}
                  onClick={closeOverlay}
                  className={`group inline-flex w-fit flex-col items-start ${headingClass} text-white/70 transition-[color,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:text-white focus-visible:-translate-y-0.5 focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none ${
                    isOverlayOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  {homeLink.label}
                </Link>

                {/* Hover/focus reveal groups. */}
                {navigationGroups.map((group, groupIndex) => {
                  const isExpanded = expandedGroup === group.label;

                  return (
                    <section
                      key={group.label}
                      className={`w-full transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                        isOverlayOpen
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }`}
                      style={{
                        transitionDelay: isOverlayOpen
                          ? `${120 + groupIndex * 45}ms`
                          : "0ms",
                      }}
                      onMouseEnter={() => setExpandedGroup(group.label)}
                      onMouseLeave={() => setExpandedGroup(null)}
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={`${menuId}-${group.label.toLowerCase()}`}
                        onFocus={() => setExpandedGroup(group.label)}
                        onClick={() =>
                          setExpandedGroup((current) =>
                            current === group.label ? null : group.label,
                          )
                        }
                        className={`group flex w-fit flex-col items-start text-left ${headingClass} transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none ${
                          isExpanded
                            ? "text-white"
                            : "text-white/46 hover:-translate-y-0.5 hover:text-white/78 focus-visible:text-white/78"
                        }`}
                      >
                        <span>{group.label}</span>
                        <span
                          aria-hidden
                          className={`mt-2 h-px bg-blue-100/70 transition-[width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                            isExpanded ? "w-full opacity-100" : "w-0 opacity-0"
                          }`}
                        />
                      </button>

                      <div
                        id={`${menuId}-${group.label.toLowerCase()}`}
                        className={`grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                          isExpanded
                            ? "grid-rows-[1fr] translate-y-0 opacity-100"
                            : "grid-rows-[0fr] -translate-y-1 opacity-0"
                        }`}
                      >
                        <div className="min-h-0">
                          <div className="flex max-w-[620px] flex-col items-start gap-3 pb-5 pt-3 sm:pt-4">
                            {group.links.map((item) =>
                              "href" in item ? (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={closeOverlay}
                                  className="group text-[clamp(1.08rem,1.45vw,1.45rem)] font-medium leading-tight text-blue-100/76 transition-[color,opacity,transform] duration-300 hover:translate-x-1 hover:text-white focus-visible:translate-x-1 focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none"
                                >
                                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px] motion-reduce:transition-none">
                                    {item.label}
                                  </span>
                                </Link>
                              ) : (
                                <div
                                  key={item.label}
                                  className="flex flex-col items-start gap-2 pt-1"
                                >
                                  <p className="text-[clamp(1.08rem,1.45vw,1.45rem)] font-medium leading-tight text-blue-100/82">
                                    {item.label}
                                  </p>

                                  {/* Third-level links are only used for SUAS 2026. */}
                                  <div className="ml-3 flex flex-col gap-2 border-l border-white/14 pl-4 sm:ml-4 sm:pl-5">
                                    {item.links.map((nestedLink) => (
                                      <Link
                                        key={nestedLink.href}
                                        href={nestedLink.href}
                                        onClick={closeOverlay}
                                        className="group text-b1 font-medium leading-tight text-white/58 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-white focus-visible:translate-x-1 focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none"
                                      >
                                        <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px] motion-reduce:transition-none">
                                          {nestedLink.label}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>
            </nav>
          ) : (
            <section
              id={searchId}
              className="mx-auto flex w-full max-w-[1720px] flex-1 items-start px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-12 lg:pt-36"
            >
              <div className="w-full max-w-[980px]">
                {/* Accessible label only. The visible "Search MUAS" text was removed. */}
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

                {/* Results only appear once the user has typed. No suggested list. */}
                {normalizedSearchQuery ? (
                  <div className="mt-9 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none">
                    {searchResultsWithMatches.length > 0 ? (
                      <div className="divide-y divide-white/10">
                        {searchResultsWithMatches.map(({ result, snippet }) => (
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
                    ) : (
                      <p className="text-[clamp(1.1rem,2vw,1.45rem)] font-medium text-white/58">
                        No results found.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
