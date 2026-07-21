export function Video() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-4 sm:px-6 lg:px-8 text-white">
      {/* Subtle, perfectly centered horizontal oval glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_50%_at_50%_50%,rgba(155,26,26,0.3)_0%,#000000_75%)]" />

      {/* Video container */}
      <div className="relative z-10 flex aspect-video w-full max-w-6xl items-center justify-center overflow-hidden rounded-xl border border-red-900/90 bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <video
          className="h-full w-full object-contain"
          src="/videos/placeholder-vid.mov"
          autoPlay
          loop
          muted
          playsInline
          controls
        />
      </div>
    </section>
  );
}