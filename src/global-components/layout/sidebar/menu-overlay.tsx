import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";
import { headingClass, overlayContentClass, overlayInnerClass } from "./navbar-classes";
import { homeLink, navigationGroups } from "./navbar-data";

type MenuOverlayProps = {
  menuId: string;
  isOverlayOpen: boolean;
  expandedGroup: string | null;
  setExpandedGroup: Dispatch<SetStateAction<string | null>>;
  closeOverlay: () => void;
};

// Renders the full-screen navigation scene while Sidebar owns overlay state.
export function MenuOverlay({
  menuId,
  isOverlayOpen,
  expandedGroup,
  setExpandedGroup,
  closeOverlay,
}: MenuOverlayProps) {
  return (
    <nav className={overlayContentClass}>
      <div className={overlayInnerClass}>
        <Link
          href={homeLink.href}
          onClick={closeOverlay}
          className={`group inline-flex w-fit flex-col items-start ${headingClass} text-white/70 transition-[color,opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:text-white focus-visible:-translate-y-0.5 focus-visible:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none ${
            isOverlayOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {homeLink.label}
        </Link>

        {navigationGroups.map((group, groupIndex) => {
          const isExpanded = expandedGroup === group.label;

          return (
            <section
              key={group.label}
              className={`w-full transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isOverlayOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: isOverlayOpen ? `${120 + groupIndex * 45}ms` : "0ms",
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

                          {/* SUAS 2026 is the only supported third-level nested item. */}
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
  );
}
