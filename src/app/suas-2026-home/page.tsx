export default function SUAS2026HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-16">
      <section>
        <p className="text-subtitle text-blue-500">SUAS 2026</p>
        <h1 className="text-h3 text-blue-900">SUAS 2026 Home</h1>
      </section>

      <section id="key-features" className="scroll-mt-10">
        <h2 className="text-h5 text-blue-900">Key Features</h2>
        <p className="mt-3 max-w-3xl text-b1 text-black-300">
          Redback Key Features
        </p>
      </section>

      <section id="technical-specifications" className="scroll-mt-10">
        <h2 className="text-h5 text-blue-900">Technical Specifications</h2>
        <p className="mt-3 max-w-3xl text-b1 text-black-300">
          Redback Technical Specifications
        </p>
      </section>
    </div>
  );
}
