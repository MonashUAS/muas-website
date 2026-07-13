import type { CSSProperties, ReactNode } from "react";

type TimelineRevealItemProps = {
  children: ReactNode;
  className: string;
  index: number;
};

export function TimelineRevealItem({
  children,
  className,
  index,
}: TimelineRevealItemProps) {
  const delay = `${Math.min(index % 3, 2) * 90}ms`;

  return (
    <article
      style={{ "--suas-reveal-delay": delay } as CSSProperties}
      data-suas-reveal=""
      data-timeline-reveal-item=""
      className={`${className} suas-timeline-reveal`}
    >
      {children}
    </article>
  );
}
