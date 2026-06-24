import { PageHero } from "@/global-components/modules/page-hero";
import { SocialLinks } from "@/global-components/modules/social-links";
import { Mail, MapPin } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <PageHero
        src="/images/heading images/contact-us.JPG"
        alt="Monash UAS team members holding an uncrewed aircraft"
        heading="CONTACT US"
        objectPositionClassName="object-[center_60%]"
        overlayClassName="bg-blue-900/50"
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:flex-1 lg:grid-cols-2 lg:items-stretch lg:py-8">
        <div className="flex flex-col rounded bg-blue-50 text-blue-900 shadow-lg">
          <header className="px-5 pt-6 sm:px-10 sm:pt-8">
            <div className="border-b border-blue-200 pb-6 sm:pb-8">
              <h2 className="text-h6 font-bold sm:text-h5">
                Contact Details
              </h2>

              <p className="mt-2 max-w-md text-b1 leading-relaxed text-black-400">
                Get in touch with the team or visit us at the Monash Makerspace.
              </p>
            </div>
          </header>

          <div className="flex flex-1 flex-col px-5 py-6 sm:px-10 sm:py-8">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-3 sm:gap-5">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-500 text-white sm:size-12"
                  aria-hidden="true"
                >
                  <Mail className="size-5" />
                </span>

                <div className="min-w-0">
                  <h3 className="text-subtitle font-bold">E-mail</h3>

                  <a
                    href="mailto:contact@monashuas.org"
                    className="mt-1 inline-block break-all text-b1 text-blue-500 underline decoration-blue-300 underline-offset-4 transition-colors hover:text-blue-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                  >
                    contact@monashuas.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-5">
                <span
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-500 text-white sm:size-12"
                  aria-hidden="true"
                >
                  <MapPin className="size-5" />
                </span>

                <div className="min-w-0">
                  <h3 className="text-subtitle font-bold">Location</h3>

                  <address className="mt-1 max-w-md text-b1 leading-relaxed text-black-400 not-italic">
                    Monash Makerspace – G.37A
                    <br />
                    23 College Walk, Monash University
                    <br />
                    Clayton Campus 3800
                  </address>
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-blue-200 pt-7 lg:mt-auto">
              <h3 className="text-subtitle font-bold">Follow Us</h3>

              <SocialLinks
                includeYouTube
                className="mt-4 flex-wrap gap-3"
                linkClassName="border border-blue-200 bg-white text-2xl text-blue-900 transition-colors hover:border-blue-400 hover:bg-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="aspect-[4/3] overflow-hidden rounded bg-black-50 shadow-lg lg:h-full lg:aspect-auto">
          <iframe
            src="https://www.google.com/maps?q=Monash+Makerspace,+G.37A+23+College+Walk,+Monash+University+Clayton+Campus+3800&output=embed"
            title="Google Maps location of Monash Makerspace"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}
