"use client";

import {
  ChevronDown,
  Handshake,
  Mail,
  MessageCircle,
  Plane,
  Search,
  Trophy,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchRegistry } from "@/lib/search-registry";

const teamSections = [
  { href: "/aerostructures", label: "Aerostructures" },
  { href: "/avionics", label: "Avionics" },
  { href: "/flight-ops", label: "Flight Operations" },
  { href: "/operations", label: "Operations" },
  { href: "/propulsion", label: "Propulsion" },
];

const competitionSections = [
  { href: "/nfc-2025", label: "NFC 2025" },
  { href: "/suas-2026-home", label: "SUAS 2026 Homepage" },
  { href: "/suas-2026-team", label: "SUAS 2026 Team" },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [teamOpen, setTeamOpen] = useState(true);
  const [competitionsOpen, setCompetitionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarRef = useRef<HTMLElement>(null);

  const searchResults = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return searchRegistry
      .filter((item) => {
        const searchableText = `${item.title} ${item.category}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [searchQuery]);

  useEffect(() => {
    function handleDocumentPointerDown(event: MouseEvent) {
      if (
        isExpanded &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentPointerDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentPointerDown);
    };
  }, [isExpanded]);

  const expandFromIcon = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 overflow-hidden border-r border-blue-500/70 bg-black-500 text-white shadow-2xl transition-[width] duration-300 ease-out ${
        isExpanded ? "w-[268px]" : "w-[68px]"
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(155deg,#001f49_0%,#02040a_46%,#05080d_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <nav className="relative flex h-full flex-col gap-5 px-3 py-10">
        <Link
          href="/"
          className={`mb-2 flex h-24 items-end ${
            isExpanded ? "justify-center" : "justify-center"
          }`}
          onMouseEnter={expandFromIcon}
        >
          <Image
            src={isExpanded ? "/logos/logo-with-text.svg" : "/logos/logo.svg"}
            alt="MUAS Logo"
            width={isExpanded ? 150 : 44}
            height={isExpanded ? 80 : 44}
            className="h-auto w-auto"
            priority
          />
        </Link>

        <div className="relative">
          <div
            className={`flex h-10 items-center border border-blue-500 bg-black-500/80 ${
              isExpanded ? "gap-3 px-4" : "justify-center px-0"
            }`}
            onMouseEnter={expandFromIcon}
          >
            <Search aria-hidden className="size-5 shrink-0 text-white" />
            {isExpanded ? (
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search..."
                className="min-w-0 flex-1 bg-transparent text-b1 text-white outline-none placeholder:text-blue-100"
              />
            ) : null}
          </div>

          {isExpanded && searchResults.length > 0 ? (
            <div className="absolute left-0 right-0 top-12 z-10 max-h-72 overflow-y-auto border border-blue-500 bg-black-500/95 shadow-xl">
              {searchResults.map((result) => (
                <Link
                  key={result.url}
                  href={result.url}
                  className="block px-4 py-3 hover:bg-blue-900"
                  onClick={() => setSearchQuery("")}
                >
                  <span className="block text-b2 text-white">{result.title}</span>
                  <span className="block text-caption text-blue-100">
                    {result.category}
                  </span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <SidebarGroup
            href="/our-team"
            icon={<UsersRound className="size-5" />}
            label="Our Team"
            isExpanded={isExpanded}
            isOpen={teamOpen}
            onExpand={expandFromIcon}
            onToggle={() => setTeamOpen((current) => !current)}
          >
            {teamSections.map((item) => (
              <SidebarSubLink key={item.href} href={item.href} label={item.label} />
            ))}
          </SidebarGroup>

          <SidebarLink
            href="/our-drones"
            icon={<Plane className="size-5" />}
            label="Our Drones"
            isExpanded={isExpanded}
            onExpand={expandFromIcon}
          />

          <SidebarGroup
            href="/competitions"
            icon={<Trophy className="size-5" />}
            label="Competitions"
            isExpanded={isExpanded}
            isOpen={competitionsOpen}
            onExpand={expandFromIcon}
            onToggle={() => setCompetitionsOpen((current) => !current)}
          >
            {competitionSections.map((item) => (
              <SidebarSubLink key={item.href} href={item.href} label={item.label} />
            ))}
          </SidebarGroup>

          <SidebarLink
            href="/newsletter"
            icon={<Mail className="size-5" />}
            label="Newsletter"
            isExpanded={isExpanded}
            onExpand={expandFromIcon}
          />
          <SidebarLink
            href="/our-sponsors"
            icon={<Handshake className="size-5" />}
            label="Sponsors"
            isExpanded={isExpanded}
            onExpand={expandFromIcon}
          />
          <SidebarLink
            href="/recruitment"
            icon={<UserRoundSearch className="size-5" />}
            label="Recruitment"
            isExpanded={isExpanded}
            onExpand={expandFromIcon}
          />
          <SidebarLink
            href="/contact-us"
            icon={<MessageCircle className="size-5" />}
            label="Contact Us"
            isExpanded={isExpanded}
            onExpand={expandFromIcon}
          />
        </div>
      </nav>
    </aside>
  );
}

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  onExpand: () => void;
};

function SidebarLink({
  href,
  icon,
  label,
  isExpanded,
  onExpand,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onMouseEnter={onExpand}
      className={`flex h-11 items-center rounded px-4 text-b1 text-white transition-colors hover:bg-blue-900/70 hover:text-blue-100 ${
        isExpanded ? "justify-start gap-5" : "justify-center"
      }`}
      aria-label={label}
    >
      <span className="shrink-0 text-blue-100">{icon}</span>
      {isExpanded ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}

type SidebarGroupProps = SidebarLinkProps & {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function SidebarGroup({
  href,
  icon,
  label,
  isExpanded,
  isOpen,
  onExpand,
  onToggle,
  children,
}: SidebarGroupProps) {
  return (
    <div>
      <div
        className={`flex h-11 items-center rounded px-4 text-b1 text-white transition-colors hover:bg-blue-900/70 ${
          isExpanded ? "gap-5" : "justify-center"
        }`}
        onMouseEnter={onExpand}
      >
        <Link
          href={href}
          className={`flex min-w-0 flex-1 items-center ${
            isExpanded ? "gap-5" : "justify-center"
          }`}
          aria-label={label}
        >
          <span className="shrink-0 text-blue-100">{icon}</span>
          {isExpanded ? <span className="truncate">{label}</span> : null}
        </Link>
        {isExpanded ? (
          <button
            type="button"
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${label}`}
            aria-expanded={isOpen}
            onClick={onToggle}
            className="grid size-7 shrink-0 place-items-center rounded text-blue-100 hover:bg-blue-800"
          >
            <ChevronDown
              aria-hidden
              className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        ) : null}
      </div>
      {isExpanded && isOpen ? (
        <div className="ml-[64px] flex flex-col gap-1 py-1">{children}</div>
      ) : null}
    </div>
  );
}

function SidebarSubLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded px-2 py-1 text-b1 text-white transition-colors hover:bg-blue-900/70 hover:text-blue-100"
    >
      {label}
    </Link>
  );
}
