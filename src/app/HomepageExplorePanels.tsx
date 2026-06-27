"use client";

import Image from "next/image";
import Link from "next/link";

type ExplorePanel = {
  title: string;
  href: string;
  preview: string;
  alt: string;
};

const temporaryPanelImage = "/images/placeholder (to be replaced)/placeholder image.jpg";

// Temporary placeholder image. Replace each panel image before final production.
// Panel labels/routes/copy live here; all panels intentionally share the same
// image while final section photography is still being selected.
const explorePanels: ExplorePanel[] = [
  {
    title: "Our Team",
    href: "/our-team",
    preview: "Meet the students behind MUAS and the teams building our aircraft.",
    alt: "Temporary Our Team panel placeholder",
  },
  {
    title: "Our Drones",
    href: "/our-drones",
    preview: "See the aircraft, systems, and technology behind our builds.",
    alt: "Temporary Our Drones panel placeholder",
  },
  {
    title: "Competitions",
    href: "/competitions",
    preview: "Follow our work across national and international UAV competitions.",
    alt: "Temporary Competitions panel placeholder",
  },
  {
    title: "Recruitment",
    href: "/recruitment",
    preview: "Help shape the next generation of drone technology with MUAS.",
    alt: "Temporary Recruitment panel placeholder",
  },
  {
    title: "Sponsor Us",
    href: "/our-sponsors",
    preview: "See the partners supporting student-led aerospace innovation.",
    alt: "Temporary Sponsor Us panel placeholder",
  },
  {
    title: "Contact",
    href: "/contact-us",
    preview: "Start a conversation with MUAS about partnerships, recruitment, or enquiries.",
    alt: "Temporary Contact panel placeholder",
  },
];

export function HomepageExplorePanels() {
  return (
    <section className="bg-[linear-gradient(180deg,#02040a_0%,#001f49_46%,#02040a_100%)] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1720px]">
        <div className="flex flex-col gap-3 lg:min-h-[620px] lg:flex-row lg:gap-2">
          {explorePanels.map((panel) => (
            <Link
              key={panel.href}
              href={panel.href}
              className="group relative min-h-[320px] overflow-hidden rounded-none bg-black-500 text-white outline-none transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-1 focus-visible:ring-white/80 motion-reduce:transition-none lg:min-h-[620px] lg:flex-[1] lg:hover:flex-[3] lg:focus-visible:flex-[3]"
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
                <span className="whitespace-nowrap text-2xl font-medium leading-none tracking-[-0.05em] text-white/90 [writing-mode:vertical-rl] xl:text-3xl">
                  {panel.title}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 opacity-100 transition-opacity duration-0 motion-reduce:transition-none sm:p-8 lg:p-7 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:duration-500 lg:group-focus-visible:opacity-100 lg:group-focus-visible:duration-500 xl:p-9">
                <div className="max-w-xl">
                  <h3 className="max-w-full break-words text-3xl font-medium leading-[0.92] tracking-[-0.05em] text-white transition-colors duration-500 group-hover:text-blue-50 group-focus-visible:text-blue-50 motion-reduce:transition-none sm:text-4xl lg:text-4xl xl:text-5xl">
                    {panel.title}
                  </h3>
                  <p className="mt-5 max-w-md text-b1 leading-7 text-blue-50/82 opacity-100 transition-opacity duration-700 motion-reduce:transition-none sm:text-subtitle">
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
