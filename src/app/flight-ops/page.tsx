export default function FlightOpsPage() {
  return <PageShell title="Flight Ops" />;
}

function PageShell({ title }: { title: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <h1 className="text-h3 text-blue-900">{title}</h1>
    </section>
  );
}
