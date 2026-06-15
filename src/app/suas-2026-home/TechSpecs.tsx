type SpecCard = {
  label: string;
  value: string;
  hoverValue: string;
  caption: string;
};

type SystemRow = {
  label: string;
  value: string;
};

type SystemGroup = {
  title: string;
  rows: SystemRow[];
};

const specCards: SpecCard[] = [
  {
    label: "Dimensions",
    value: "36' x 36' x 14'",
    hoverValue: "908 x 908 x 358 mm",
    caption: "Deployed State Dimensions",
  },
  {
    label: "Dimensions",
    value: "22' x 14' x 9'",
    hoverValue: "559 x 356 x 229 mm",
    caption: "Collapsed State Dimensions",
  },
  {
    label: "Total Weight",
    value: "20.2 lbs",
    hoverValue: "9.124 kg",
    caption: "All-up Weight",
  },
  {
    label: "MTOW",
    value: "27.5 lbs",
    hoverValue: "12.488 kg",
    caption: "Max. Takeoff Weight",
  },
  {
    label: "Range",
    value: "--",
    hoverValue: "--",
    caption: "Total Operating Range",
  },
  {
    label: "Max Flight Speed",
    value: "--",
    hoverValue: "--",
    caption: "Maximum Flight Speed",
  },
  {
    label: "Map Resolution",
    value: "HD 1080 p",
    hoverValue: "HD 1080 p",
    caption: "1920p x 1080p ~6cm/pixel",
  },
  {
    label: "Payload Capacity",
    value: "14.5 oz",
    hoverValue: "410 g",
    caption: "Beacon + Water Bottle",
  },
];

const systemGroups: SystemGroup[] = [
  {
    title: "Propulsion",
    rows: [
      { label: "Motor Model", value: "M6C10-150KV" },
      { label: "ESC Rating", value: "60A" },
      { label: "Battery Capacity", value: "599.4Wh (6 x 99.9Wh)" },
      { label: "Propellor size", value: "21'" },
    ],
  },
  {
    title: "Vision",
    rows: [
      { label: "Camera", value: "SIYI A8 Mini Gimbal Camera" },
      { label: "Ground Sample Distance", value: "-" },
      { label: "Object Detection Model", value: "-" },
    ],
  },
  {
    title: "Lifeline",
    rows: [{ label: "Payload Delivery", value: "Tethered with electromagnetic braking" }],
  },
  {
    title: "Flight Operations",
    rows: [
      { label: "Flight Controller", value: "CubePilot Cube Orange+" },
      { label: "Autopilot Firmware", value: "Arducopter 4.6.3" },
    ],
  },
];

// TechSpecs renders Redback metrics and systems in the supplied dark technical layout.
export function TechSpecs() {
  return (
    <section id="technical-specifications" className="scroll-mt-10 bg-black-500 px-6 py-20 text-white lg:px-14">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-h5 uppercase leading-tight text-white">Technical Specifications</h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {specCards.map((spec) => (
            <SpecMetric key={`${spec.label}-${spec.caption}`} spec={spec} />
          ))}
        </div>

        <div className="mt-14">
          <h3 className="text-subtitle uppercase text-white">Systems</h3>
          <div className="mt-6 border-t border-white/80">
            {systemGroups.map((group) => (
              <SystemTableGroup key={group.title} group={group} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// SpecMetric swaps imperial/metric hover text and applies the red gradient hover state.
function SpecMetric({ spec }: { spec: SpecCard }) {
  return (
    <div className="group min-h-36 border border-red-800 bg-black-500 p-5 transition-colors hover:bg-[linear-gradient(180deg,rgba(118,15,15,0.95),rgb(0,0,0))]">
      <p className="text-caption uppercase leading-4 text-white/70">{spec.label}</p>
      <div className="relative mt-1 min-h-8">
        <p className="absolute text-subtitle leading-7 text-white transition-opacity group-hover:opacity-0">{spec.value}</p>
        <p className="absolute text-subtitle leading-7 text-white opacity-0 transition-opacity group-hover:opacity-100">
          {spec.hoverValue}
        </p>
      </div>
      <p className="mt-8 max-w-32 text-caption leading-5 text-white/75">{spec.caption}</p>
    </div>
  );
}

// SystemTableGroup renders one bordered table segment for a Redback subsystem.
function SystemTableGroup({ group }: { group: SystemGroup }) {
  return (
    <div className="border-b border-white/70 py-4">
      <h4 className="text-center text-b1 text-white">{group.title}</h4>
      <div className="mt-4 grid gap-4">
        {group.rows.map((row) => (
          <SystemTableRow key={row.label} row={row} />
        ))}
      </div>
    </div>
  );
}

// SystemTableRow keeps each system value aligned with the visual divider mark.
function SystemTableRow({ row }: { row: SystemRow }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] items-center gap-6 text-b1 text-white">
      <p className="text-right">{row.label}</p>
      <p className="text-center">{`//`}</p>
      <p>{row.value}</p>
    </div>
  );
}
