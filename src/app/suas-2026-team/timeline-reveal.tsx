import {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type TimelineRevealItemProps = {
  children: ReactNode;
  className: string;
  index: number;
  id?: string;
};

export const TimelineRevealItem = forwardRef<
  HTMLElement,
  TimelineRevealItemProps
>(function TimelineRevealItem({ children, className, index, id }, ref) {
  const delay = `${Math.min(index % 3, 2) * 90}ms`;

  return (
    <article
      ref={ref}
      id={id}
      style={{ "--suas-reveal-delay": delay } as CSSProperties}
      data-suas-reveal=""
      data-timeline-reveal-item=""
      data-search-target-id={id}
      data-search-managed={id ? "true" : undefined}
      className={`${className} suas-timeline-reveal`}
    >
      {children}
    </article>
  );
});
