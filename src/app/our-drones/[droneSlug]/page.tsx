type DronePageProps = {
  params: Promise<{
    droneSlug: string;
  }>;
};

export default async function DronePage({ params }: DronePageProps) {
  const { droneSlug } = await params;

  return (
    <section className="mx-auto flex w-full max-w-7xl viewport-fold flex-col justify-center px-6 py-16">
      <p className="text-subtitle text-blue-300">Drone</p>
      <h1 className="text-h3 text-blue-100">{droneSlug}</h1>
    </section>
  );
}
