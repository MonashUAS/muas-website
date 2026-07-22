import type { DroneSpec } from "./drone-data";

type SpecListProps = {
  title: string;
  specs: DroneSpec[];
  searchPrefix?: string;
};

// SpecList displays label/value rows in the shared drone detail format.
export function SpecList({ title, specs, searchPrefix }: SpecListProps) {
  return (
    <section>
      <h3 className="mb-5 text-center text-h7 font-black uppercase leading-none text-blue-900 tracking-[-0.05em]">
        {title}
      </h3>
      <dl className="mx-auto max-w-sm space-y-4 text-center text-caption sm:text-b2">
        {specs.map((spec) => (
          <div key={`${spec.label}-${spec.value}`} className="grid grid-cols-[1fr_auto_1fr] gap-5">
            <dt
              data-search-target-id={
                searchPrefix
                  ? `${searchPrefix}-${spec.label.toLowerCase().replaceAll(" ", "-")}-label`
                  : undefined
              }
              data-search-highlight-mode={searchPrefix ? "text" : undefined}
              className="text-right text-black-500"
            >
              {spec.label}
            </dt>
            <dd className="text-black-500">{" "}</dd>
            <dd
              data-search-target-id={
                searchPrefix
                  ? `${searchPrefix}-${spec.label.toLowerCase().replaceAll(" ", "-")}-value`
                  : undefined
              }
              data-search-highlight-mode={searchPrefix ? "text" : undefined}
              className="text-left text-black-500"
            >
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
