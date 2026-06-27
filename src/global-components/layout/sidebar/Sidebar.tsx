"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

const navigationGroups = [
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
      { href: "/nfc-2025", label: "NFC 2025" },
      { href: "/suas-2026-home", label: "SUAS 2026 Homepage" },
      { href: "/suas-2026-team", label: "SUAS 2026 Team" },
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
  "mx-auto flex h-20 w-full max-w-[1720px] items-center justify-between px-5 sm:px-8 lg:px-12";

const logoClass = "h-auto w-[116px] sm:w-[148px]";

const navButtonClass =
  "group flex h-11 min-w-[112px] items-center justify-center gap-3 rounded-full bg-white/[0.055] px-5 text-b2 uppercase tracking-[0.18em] text-white/88 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 motion-reduce:transition-none";

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Discover");
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const openMenu = () => {
    setActiveGroup("Discover");
    setIsMenuOpen(true);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(155deg,#001f49_0%,#02040a_46%,#05080d_100%)] text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)]">
        <nav className={topRowClass}>
          <Link
            href="/"
            className="relative z-10 flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            aria-label="MUAS home"
          >
            <Image
              src="/logos/logo-with-text.svg"
              alt="MUAS Logo"
              width={148}
              height={54}
              className={logoClass}
              priority
            />
          </Link>

          <button
            type="button"
            aria-label="Open navigation menu"
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            onClick={openMenu}
            className={`relative z-10 ${navButtonClass}`}
          >
            <span>Menu</span>
            <span className="flex w-6 flex-col gap-1.5" aria-hidden>
              <span className="h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              <span className="h-px w-4 bg-current self-end transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none" />
            </span>
          </button>
        </nav>
      </header>

      <div
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className={`fixed inset-0 z-[60] overflow-y-auto bg-[#02050b] text-white transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
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
            isMenuOpen ? "translate-y-0" : "translate-y-4"
          }`}
        >
          <div className={topRowClass}>
            <Link
              href="/"
              aria-label="MUAS home"
              onClick={closeMenu}
              className="relative z-10 flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            >
              <Image
                src="/logos/logo-with-text.svg"
                alt="MUAS Logo"
                width={148}
                height={54}
                className={logoClass}
                priority
              />
            </Link>

            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className={navButtonClass}
            >
              Close
            </button>
          </div>

          <nav className="mx-auto flex w-full max-w-[1720px] flex-1 items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="w-full max-w-[1120px]">
              {navigationGroups.map((group, groupIndex) => (
                <section
                  key={group.label}
                  className={`border-t border-white/12 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] last:border-b motion-reduce:transition-none ${
                    isMenuOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: isMenuOpen ? `${120 + groupIndex * 55}ms` : "0ms" }}
                >
                  <button
                    type="button"
                    aria-expanded={activeGroup === group.label}
                    aria-controls={`${menuId}-${group.label.toLowerCase()}`}
                    onClick={() =>
                      setActiveGroup((current) =>
                        current === group.label ? "" : group.label,
                      )
                    }
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-h5 leading-none text-white/76 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none sm:py-7 sm:text-h4 lg:text-[72px]"
                  >
                    <span>{group.label}</span>
                    <span className="text-b1 uppercase tracking-[0.18em] text-blue-100/58 transition-colors duration-300 group-hover:text-blue-100 motion-reduce:transition-none">
                      {activeGroup === group.label ? "Close" : "Open"}
                    </span>
                  </button>

                  <div
                    id={`${menuId}-${group.label.toLowerCase()}`}
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                      activeGroup === group.label
                        ? "grid-rows-[1fr] translate-y-0 opacity-100"
                        : "grid-rows-[0fr] -translate-y-2 opacity-0"
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="grid gap-3 pb-7 sm:grid-cols-2 sm:gap-x-10 lg:ml-[36%] lg:max-w-[680px]">
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeMenu}
                            className="group text-subtitle leading-tight text-white/78 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none sm:text-h7"
                          >
                            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] motion-reduce:transition-none">
                              {link.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
