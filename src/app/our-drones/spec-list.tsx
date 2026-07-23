import type { DroneSpec } from "./drone-data";

type SpecListProps = {
  title: string;
  specs: DroneSpec[];
  tone?: "light" | "dark";
  compact?: boolean;
};

// SpecList displays label/value rows in the shared drone detail format.
export function SpecList({ title, specs, tone = "light", compact = false }: SpecListProps) {
  const titleClass = tone === "dark" ? "text-white" : "text-blue-900";
  const textClass = tone === "dark" ? "text-blue-50/80" : "text-black-500";

  return (
    <section>
      <h3
        className={`text-center font-black leading-none tracking-[-0.05em] ${compact ? "mb-3 text-b1 sm:text-h7" : "mb-5 text-h7"} ${titleClass}`}
      >
        {title}
      </h3>
      <dl
        className={`mx-auto max-w-sm text-center text-caption sm:text-b2 ${
          compact ? "space-y-2.5" : "space-y-4"
        }`}
      >
        {specs.map((spec) => (
          <div
            key={`${spec.label}-${spec.value}`}
            className={`grid grid-cols-[1fr_auto_1fr] ${compact ? "gap-2 sm:gap-3" : "gap-5"}`}
          >
            <dt className={`text-right ${textClass}`}>{spec.label}</dt>
            <dd className={textClass}>{" "}</dd>
            <dd className={`text-left ${textClass}`}>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
