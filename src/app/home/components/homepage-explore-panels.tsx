"use client";

import Image from "next/image";
import Link from "next/link";
import { explorePanels, temporaryPanelImage } from "../data/explore-panels";

// This section remains the cinematic image-panel navigation near the top of
// the homepage. Panel data is separated so labels/routes/images have one edit point.
export function HomepageExplorePanels() {
  return (
    <section className="bg-[linear-gradient(180deg,#02040a_0%,#001f49_46%,#02040a_100%)] px-4 py-5 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1720px]">
        {/* Mobile uses stacked cards because hover expansion is unreliable on touch devices. */}
        <div className="flex flex-col gap-3 md:hidden">
          {explorePanels.map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              className="group relative min-h-[120px] overflow-hidden rounded-xl border border-white/12 bg-black-500 text-white outline-none focus-visible:ring-1 focus-visible:ring-white/80"
            >
              <Image
                src={temporaryPanelImage}
                alt={panel.alt}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-500 group-active:scale-[1.02] motion-reduce:transition-none"
              />

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,31,73,0.58),rgba(0,0,0,0.5))]" />

              <div className="relative z-10 flex min-h-[120px] flex-col justify-end p-4">
                <h3 className="text-xl font-medium leading-none tracking-[-0.05em] text-white">
                  {panel.title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-5 text-blue-50/86">
                  {panel.preview}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden gap-3 md:flex md:flex-col lg:min-h-[420px] lg:flex-row lg:gap-2">
          {explorePanels.map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              className="group relative min-h-[220px] overflow-hidden rounded-none bg-black-500 text-white outline-none transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-1 focus-visible:ring-white/80 motion-reduce:transition-none lg:min-h-[420px] lg:flex-[1] lg:hover:flex-[3] lg:focus-visible:flex-[3]"
            >
              <Image
                src={temporaryPanelImage}
                alt={panel.alt}
                fill
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transition-none"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.82))] transition-opacity duration-700 group-hover:opacity-70 group-focus-visible:opacity-70 motion-reduce:transition-none lg:bg-[linear-gradient(90deg,rgba(0,0,0,0.8),rgba(0,31,73,0.48),rgba(0,0,0,0.62))]" />
              <div className="absolute inset-0 bg-blue-500/0 transition-colors duration-700 group-hover:bg-blue-500/[0.08] group-focus-visible:bg-blue-500/[0.08] motion-reduce:transition-none" />

              {/* Separate label layers prevent hover-off text jumps; only opacity changes. */}
              <div className="absolute inset-0 z-10 hidden place-items-center transition-opacity duration-500 group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none lg:grid">
                <span className="whitespace-nowrap text-xl font-medium leading-none tracking-[-0.05em] text-white/90 [writing-mode:vertical-rl] xl:text-2xl">
                  {panel.title}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-5 opacity-100 transition-opacity duration-0 motion-reduce:transition-none sm:p-6 lg:p-6 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:duration-500 lg:group-focus-visible:opacity-100 lg:group-focus-visible:duration-500 xl:p-7">
                <div className="max-w-xl">
                  <h3 className="max-w-full break-words text-2xl font-medium leading-[0.92] tracking-[-0.05em] text-white transition-colors duration-500 group-hover:text-blue-50 group-focus-visible:text-blue-50 motion-reduce:transition-none sm:text-3xl lg:text-3xl xl:text-4xl">
                    {panel.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-blue-50/82 opacity-100 transition-opacity duration-700 motion-reduce:transition-none sm:text-b1">
                    {panel.preview}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
