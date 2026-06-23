import { SponsorGrid } from "@/global-components/modules/sponsor-grid";

export default function OurSponsorsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
      <div className="max-w-3xl space-y-6 text-b1 text-black-400 sm:text-subtitle">
        <p>
          Our sponsors provide us with resources that greatly assist us in our
          performance and development as a team. They keep us innovating and
          flying!
        </p>
        <p>A huge thank you to all our sponsors.</p>
      </div>

      <h1 className="mb-10 mt-14 text-h6 text-blue-900 sm:mb-14 sm:mt-20 sm:text-h5 lg:text-h4">
        Thanks to
      </h1>

      <SponsorGrid />
    </section>
  );
}
