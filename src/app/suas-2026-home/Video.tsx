import { Play } from "lucide-react";

export function Video() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-black-500 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(214,28,28,0.24),transparent_34%),linear-gradient(180deg,#050505_0%,#111_100%)]" />
      <div className="relative flex aspect-video w-full max-w-6xl items-center justify-center border border-red-700 bg-black-500/80 shadow-2xl">
        <button
          type="button"
          className="grid size-20 place-items-center border border-red-600 text-white transition-colors hover:bg-red-900/30"
          aria-label="Video placeholder"
        >
          <Play className="size-9 translate-x-0.5" aria-hidden />
        </button>
      </div>
    </section>
  );
}

