export default function OurTeamPage() {
  return <PageShell title="Our Team" />;
}

function PageShell({ title }: { title: string }) {
  return (
    <section
      id="our-team-page"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-6 py-16"
    >
      <h1 className="text-h3 text-blue-900">{title}</h1>
    </section>
  );
}
