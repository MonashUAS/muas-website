import Link from "next/link";
import { ImageIcon } from "lucide-react";

// TeamLink introduces the Redback team journey with a large visual placeholder and CTA.
export function TeamLink() {
  return (
    <section className="bg-black-500 px-6 py-20 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h2 className="text-h5 uppercase leading-tight text-white">The Redback Team</h2>
        <p className="mt-4 max-w-2xl text-subtitle leading-7 text-white">
          Learn about the people behind Redback and key design decisions made along the way towards SUAS 2026.
        </p>

        <div className="mt-5 grid aspect-[5/4] w-full place-items-center rounded bg-black-50 text-black-200">
          <ImageIcon className="size-52 stroke-[1.3]" aria-hidden />
        </div>

        <Link
          href="/suas-2026-team"
          className="mt-4 inline-flex min-h-12 items-center justify-center border border-blue-500 px-5 text-b1 uppercase text-white transition-colors hover:bg-blue-900/40"
        >
          View the Journey
        </Link>
      </div>
    </section>
  );
}
