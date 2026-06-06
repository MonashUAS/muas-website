import Link from "next/link";
import { type SidebarLinkProps } from "./sidebar-link";
import { ChevronDown } from "lucide-react";;

// TypeScript Interface: Defines the properties needed for a dropdown link group
export type SidebarGroupProps = SidebarLinkProps & {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

// Main Dropdown Group Component (e.g., "Our Team" or "Competitions")
export function SidebarGroup({
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
      {/* Top Header Layer: Contains the main link icon, section title, and toggle button */}
      <div
        className={`flex h-11 items-center rounded px-4 text-b1 text-white transition-colors hover:bg-blue-900/70 ${
          isExpanded ? "gap-5" : "justify-center"
        }`}
        onMouseEnter={onExpand}
      >
        {/* Main Clickable Text & Icon linking to the landing page */}
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
        
        {/* Chevron Toggle Arrow: toggles the dropdown */}
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
      
      {/* shows child links only when both expanded and open */}
      {isExpanded && isOpen ? (
        <div className="ml-[64px] flex flex-col gap-1 py-1">{children}</div>
      ) : null}
    </div>
  );
}

// Child links that appear when a group is expanded (e.g., "The Redback Team" under "Our Team")
export function SidebarSubLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded px-2 py-1 text-b1 text-white transition-colors hover:bg-blue-900/70 hover:text-blue-100"
    >
      {label}
    </Link>
  );
}