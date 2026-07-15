export default function CompetitionsPage() {
  return <PageShell title="Competitions" />;
}

function PageShell({ title }: { title: string }) {
  return (
    <section className="mx-auto flex w-full max-w-7xl viewport-fold flex-col justify-center px-6 py-16">
      <h1 className="text-h3 text-blue-100">{title}</h1>
    </section>
  );
}
