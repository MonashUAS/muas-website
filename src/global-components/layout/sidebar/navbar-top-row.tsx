import { Search } from "lucide-react";
import { BrandLink } from "./brand-link";
import { navButtonClass, topRowClass } from "./navbar-classes";

export type OverlayMode = "menu" | "search" | null;

type NavbarTopRowProps = {
  overlayMode: OverlayMode;
  menuId: string;
  searchId: string;
  openMenu: () => void;
  openSearch: () => void;
  closeOverlay: () => void;
  isOverlayHeader?: boolean;
};

// Renders the shared three-zone navbar. In an overlay, the side that opened it
// becomes Close while the opposite side remains available for mode switching.
export function NavbarTopRow({
  overlayMode,
  menuId,
  searchId,
  openMenu,
  openSearch,
  closeOverlay,
  isOverlayHeader = false,
}: NavbarTopRowProps) {
  const isOverlayOpen = overlayMode !== null;
  const isMenuMode = overlayMode === "menu";
  const isSearchMode = overlayMode === "search";

  const leftControl =
    isOverlayHeader && isMenuMode ? (
      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={closeOverlay}
        className={`justify-self-start ${navButtonClass}`}
      >
        Close
      </button>
    ) : (
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-controls={menuId}
        aria-expanded={isMenuMode}
        onClick={openMenu}
        className={`justify-self-start ${isOverlayHeader ? "" : "relative z-10"} ${navButtonClass}`}
      >
        Menu
      </button>
    );

  const rightControl =
    isOverlayHeader && isSearchMode ? (
      <button
        type="button"
        aria-label="Close search overlay"
        onClick={closeOverlay}
        className={`justify-self-end ${navButtonClass}`}
      >
        Close
      </button>
    ) : (
      <button
        type="button"
        aria-label="Open site search"
        aria-controls={searchId}
        aria-expanded={isSearchMode}
        onClick={openSearch}
        className={`justify-self-end gap-1.5 ${isOverlayHeader ? "" : "relative z-10"} ${navButtonClass}`}
      >
        <Search aria-hidden className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
    );

  return (
    <div className={topRowClass}>
      {leftControl}
      <BrandLink isMenuOpen={isOverlayOpen} onClick={isOverlayHeader ? closeOverlay : undefined} />
      {rightControl}
    </div>
  );
}
