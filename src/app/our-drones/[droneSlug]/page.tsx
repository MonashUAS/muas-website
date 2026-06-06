type DronePageProps = {
  params: Promise<{
    droneSlug: string;
  }>;
};

export default async function DronePage({ params }: DronePageProps) {
  const { droneSlug } = await params;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16">
      <p className="text-subtitle text-blue-500">Drone</p>
      <h1 className="text-h3 text-blue-900">{droneSlug}</h1>
    </section>
  );
}
