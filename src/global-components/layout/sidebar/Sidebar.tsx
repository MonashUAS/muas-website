"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { MenuOverlay } from "./menu-overlay";
import { NavbarTopRow } from "./navbar-top-row";
import type { OverlayMode } from "./navbar-top-row";
import { SearchOverlay } from "./search-overlay";

export default function Sidebar() {
  const [overlayMode, setOverlayMode] = useState<OverlayMode>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const menuId = useId();
  const searchId = useId();

  const isOverlayOpen = overlayMode !== null;
  const isSearchMode = overlayMode === "search";

  const closeOverlay = useCallback(() => {
    setOverlayMode(null);
    setExpandedGroup(null);
  }, []);

  // The menu and search views share one full-screen overlay shell.
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

  const openMenu = () => {
    setExpandedGroup(null);
    setOverlayMode("menu");
  };

  const openSearch = () => {
    setExpandedGroup(null);
    setOverlayMode("search");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(155deg,#001f49_0%,#02040a_46%,#05080d_100%)] text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
        <nav>
          <NavbarTopRow
            overlayMode={overlayMode}
            menuId={menuId}
            searchId={searchId}
            openMenu={openMenu}
            openSearch={openSearch}
            closeOverlay={closeOverlay}
          />
        </nav>
      </header>

      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label={isSearchMode ? "Site search" : "Main navigation"}
        className={`fixed inset-0 z-[60] overflow-y-auto bg-[#02050b] text-white transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isOverlayOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
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
          <NavbarTopRow
            overlayMode={overlayMode}
            menuId={menuId}
            searchId={searchId}
            openMenu={openMenu}
            openSearch={openSearch}
            closeOverlay={closeOverlay}
            isOverlayHeader
          />

          {overlayMode === "menu" ? (
            <MenuOverlay
              menuId={menuId}
              isOverlayOpen={isOverlayOpen}
              expandedGroup={expandedGroup}
              setExpandedGroup={setExpandedGroup}
              closeOverlay={closeOverlay}
            />
          ) : null}

          {overlayMode === "search" ? (
            <SearchOverlay searchId={searchId} closeOverlay={closeOverlay} />
          ) : null}
        </div>
      </div>
    </>
  );
}
