import type { DroneSpec } from "./drone-data";

type SpecListProps = {
  title: string;
  specs: DroneSpec[];
};

// SpecList displays label/value rows in the shared drone detail format.
export function SpecList({ title, specs }: SpecListProps) {
  return (
    <section>
      <h3 className="mb-5 text-center text-h7 font-black uppercase leading-none text-blue-900 sm:text-left">
        {title}
      </h3>
      <dl className="space-y-4 text-caption sm:text-b2">
        {specs.map((spec) => (
          <div key={`${spec.label}-${spec.value}`} className="grid grid-cols-[1fr_auto_1fr] gap-5">
            <dt className="text-right text-black-500">{spec.label}</dt>
            <dd className="text-black-500">{"//"}</dd>
            <dd className="text-left text-black-500">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
