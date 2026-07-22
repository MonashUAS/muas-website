export type FilterPillItem = {
  id: string;
  label: string;
};

type FilterPillNavProps = {
  ariaLabel: string;
  items: FilterPillItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
};

const navClassName =
  "mx-auto flex max-w-max gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden";

const activePillClassName =
  "border-white bg-white text-blue-900";

const inactivePillClassName =
  "border-white/20 bg-white/[0.05] text-blue-100 hover:bg-white/[0.1] hover:text-white";

const pillClassName =
  "shrink-0 rounded-full border px-5 py-2.5 text-b2 font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/70 motion-reduce:transition-none sm:text-b1";

// FilterPillNav renders a single-row, horizontally scrollable pill selector.
export function FilterPillNav({
  ariaLabel,
  items,
  activeId,
  onSelect,
  className = "",
}: FilterPillNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={`${navClassName} ${className}`.trim()}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(item.id)}
            className={`${pillClassName} ${
              isActive ? activePillClassName : inactivePillClassName
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
