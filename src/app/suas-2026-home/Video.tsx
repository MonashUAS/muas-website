import { getVideoPosterSrc } from "@/lib/media-paths";

const redbackVideoSrc = "/videos/redback-video.mp4";

export function Video() {
  return (
    <section className="relative grid place-items-center overflow-hidden bg-black px-4 py-6 text-white sm:min-h-[62svh] sm:px-6 sm:py-10 lg:min-h-[72svh] lg:px-8 lg:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_140%_50%_at_50%_50%,rgba(155,26,26,0.3)_0%,#000000_75%)]" />

      <div className="relative z-10 flex aspect-video w-full max-w-[1600px] items-center justify-center overflow-hidden border border-red-900/90 bg-black">
        <video
          className="h-full w-full object-contain"
          src={redbackVideoSrc}
          poster={getVideoPosterSrc(redbackVideoSrc)}
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
