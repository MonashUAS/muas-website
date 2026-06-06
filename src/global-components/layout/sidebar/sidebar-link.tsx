import Link from "next/link";

// TypeScript Type: Defines what details a single icon link needs to function 
export type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  onExpand: () => void;
};

// Standalone Link Component: Used for single menu options (e.g., Newsletter, Sponsors) 
export function SidebarLink({
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
      {/* Renders the navigation icon */}
      <span className="shrink-0 text-blue-100">{icon}</span>
      
      {/* "truncate" cuts off long text with dots (...) so it fits neatly on one line */}
      {isExpanded ? <span className="truncate">{label}</span> : null}
    </Link>
  );
}