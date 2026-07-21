export function Video() {
  return (
    <section className="relative h-screen overflow-hidden bg-black-500">
      <video
        className="h-full w-full object-cover"
        src="/videos/placeholder-vid.mov"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
}
