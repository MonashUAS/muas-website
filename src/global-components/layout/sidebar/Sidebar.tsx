"use client";

import {
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
import { useEffect, useRef, useState } from "react";
import { SidebarLink } from "./sidebar-link";
import { SidebarGroup, SidebarSubLink } from "./sidebar-group";
import { SidebarSearch } from "./sidebar-search";

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

{/* Main sidebar container: changes width smoothly when expanded/collapsed */}
export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [teamOpen, setTeamOpen] = useState(true);
  const [competitionsOpen, setCompetitionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarRef = useRef<HTMLElement>(null);

// Closes the sidebar if the user clicks anywhere outside of it
  useEffect(() => {
    function handleDocumentPointerDown(event: MouseEvent) {
      if (
        isExpanded &&                                      // 1. Sidebar must be open
        sidebarRef.current &&                              // 2. Sidebar must exist in HTML
        !sidebarRef.current.contains(event.target as Node) // 3. Click must be outside sidebar area
      ) {
        setIsExpanded(false);                              // Close it
      }
    }

    // Start listening for clicks on the screen
    document.addEventListener("mousedown", handleDocumentPointerDown);

    // Stop listening for clicks when the sidebar disappears (prevents slow performance)
    return () => {
      document.removeEventListener("mousedown", handleDocumentPointerDown);
    };
  }, [isExpanded]); // Re-run this check whenever the sidebar opens or closes

  // Opens the sidebar when a user hovers their mouse over an icon
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
      {/* Background visual styles: sleek dark metallic gradient and soft blur */}
      <div className="absolute inset-0 bg-[linear-gradient(155deg,#001f49_0%,#02040a_46%,#05080d_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      {/* Navigation Layout Wrapper */}
      <nav className="relative flex h-full flex-col gap-5 px-3 py-10">
        
        {/* Homepage Link & Team Logo: Swaps between micro-logo and full brand text on hover */}
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

        {/* Search */}
        <SidebarSearch
          isExpanded={isExpanded}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onExpand={expandFromIcon}
        />

        {/* Main List of Navigation Links */}
        <div className="flex flex-col gap-2">
          
          {/* Team links (dropdown) */}
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

          {/* Competition links (dropdown) */}
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




