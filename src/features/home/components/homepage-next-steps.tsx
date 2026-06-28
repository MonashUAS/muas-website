import Link from "next/link";
import { nextSteps } from "../data/next-steps";

// A distinct post-sponsor navigation section. It uses text-led rows instead
// of image panels so the lower homepage has a different exploration rhythm.
export function HomepageNextSteps() {
  return (
    <section
      className="bg-[linear-gradient(155deg,#001f49_0%,#02040a_48%,#05080d_100%)] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      aria-labelledby="homepage-next-steps-heading"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="max-w-3xl">
          <p className="text-b2 font-medium uppercase tracking-[0.22em] text-blue-100/64">
            Continue Exploring
          </p>
          <h2
            id="homepage-next-steps-heading"
            className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em]"
          >
            Where To Next
          </h2>
        </div>

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {nextSteps.map((step, index) => (
            <Link
              key={step.href}
              href={step.href}
              className="group grid gap-4 py-7 outline-none transition-colors duration-300 hover:bg-white/[0.035] focus-visible:bg-white/[0.045] focus-visible:ring-1 focus-visible:ring-white/60 motion-reduce:transition-none sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:px-4 lg:px-6"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-b2 text-blue-100/42">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[clamp(1.8rem,4vw,3.6rem)] font-medium leading-none tracking-[-0.05em] text-white transition-colors duration-300 group-hover:text-blue-50 motion-reduce:transition-none">
                  {step.title}
                </span>
              </div>

              <p className="max-w-xl text-b1 leading-7 text-blue-50/70 transition-colors duration-300 group-hover:text-blue-50/90 motion-reduce:transition-none sm:justify-self-start">
                {step.description}
              </p>

              <span
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 text-xl text-blue-50/76 transition-[transform,border-color,color,background-color] duration-300 group-hover:translate-x-1 group-hover:border-white/36 group-hover:bg-white/[0.08] group-hover:text-white motion-reduce:transition-none sm:justify-self-end"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
