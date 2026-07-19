"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type AnimatedTextHighlightVariant = "gold" | "redback";

type AnimatedTextHighlightProps = {
  children: ReactNode;
  variant: AnimatedTextHighlightVariant;
  className?: string;
};

const HIGHLIGHT_VARIANTS: Record<
  AnimatedTextHighlightVariant,
  {
    color: string;
    fill: string;
    shadow: string;
  }
> = {
  gold: {
    color: "#e4c56a",
    fill: "rgb(228 197 106 / 0.58)",
    shadow: "rgb(228 197 106 / 0.38)",
  },
  redback: {
    color: "#d52b2b",
    fill: "rgb(213 43 43 / 0.5)",
    shadow: "rgb(213 43 43 / 0.32)",
  },
};

export function AnimatedTextHighlight({
  children,
  variant,
  className = "",
}: AnimatedTextHighlightProps) {
  const highlightRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const highlight = highlightRef.current;

    if (!highlight) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12%",
        threshold: 0.2,
      },
    );

    observer.observe(highlight);

    return () => observer.disconnect();
  }, []);

  const colors = HIGHLIGHT_VARIANTS[variant];
  const style = {
    "--animated-text-highlight-color": colors.color,
    "--animated-text-highlight-fill": colors.fill,
    "--animated-text-highlight-shadow": colors.shadow,
  } as CSSProperties;

  return (
    <strong
      ref={highlightRef}
      className={`animated-text-highlight ${className}`}
      style={style}
    >
      {children}

      <style jsx>{`
        .animated-text-highlight {
          background-image:
            linear-gradient(
              178deg,
              transparent 0.12em,
              var(--animated-text-highlight-fill) 0.12em,
              var(--animated-text-highlight-fill) 0.78em,
              transparent 0.78em
            ),
            linear-gradient(
              2deg,
              transparent 0.2em,
              var(--animated-text-highlight-shadow) 0.2em,
              var(--animated-text-highlight-shadow) 0.68em,
              transparent 0.68em
            );
          background-position:
            0 0.42em,
            0 0.5em;
          background-repeat: no-repeat;
          background-size:
            0% 1em,
            0% 0.9em;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
          color: #ffffff;
          font-weight: 900;
          padding-inline: 0.08em;
          transition: background-size 920ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .animated-text-highlight.is-visible {
          background-size:
            100% 1em,
            100% 0.9em;
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-text-highlight {
            background-size:
              100% 1em,
              100% 0.9em;
            transition: none;
          }
        }
      `}</style>
    </strong>
  );
}
