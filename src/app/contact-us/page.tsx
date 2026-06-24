import { SocialLinks } from "@/global-components/modules/social-links";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function ContactUsPage() {
  return (
    <div>
      <section className="relative flex h-[320px] items-center justify-center overflow-hidden sm:h-[420px] lg:h-[520px]">
        <Image
          src="/images/heading images/contact-us.JPG"
          alt="Monash UAS team members holding an uncrewed aircraft"
          fill
          priority
          sizes="(min-width: 68px) calc(100vw - 68px), 100vw"
          className="object-cover object-[center_60%]"
        />
        <div className="absolute inset-0 bg-blue-900/50" />
        <h1 className="relative px-6 text-center text-h6 font-bold tracking-[-0.07em] text-white sm:text-h3 lg:text-h2">
          CONTACT US
        </h1>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:py-12 lg:grid-cols-2 lg:items-stretch lg:gap-10">
        <div className="rounded bg-blue-50 p-6 text-blue-900 sm:p-8 lg:p-10">
          <h2 className="text-h6 font-bold sm:text-h5">Contact Details</h2>

          <div className="mt-8 space-y-8">
            <div className="flex items-start gap-4">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-500 text-white"
                aria-hidden="true"
              >
                <Mail className="size-5" />
              </span>
              <div>
                <h3 className="text-subtitle font-bold">E-mail</h3>
                <a
                  href="mailto:contact@monashuas.org"
                  className="mt-1 inline-block break-all text-b1 text-blue-500 underline decoration-blue-300 underline-offset-4 transition-colors hover:text-blue-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                >
                  contact@monashuas.org
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-500 text-white"
                aria-hidden="true"
              >
                <MapPin className="size-5" />
              </span>
              <div>
                <h3 className="text-subtitle font-bold">Location</h3>
                <address className="mt-1 text-b1 leading-relaxed not-italic text-black-400">
                  Monash Makerspace – G.37A 23 College Walk, Monash University
                  Clayton Campus 3800
                </address>
              </div>
            </div>

            <div>
              <h3 className="text-subtitle font-bold">Follow Us</h3>
              <SocialLinks
                className="mt-3 gap-3"
                linkClassName="border border-blue-200 bg-white text-2xl text-blue-900 hover:bg-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="aspect-[4/3] overflow-hidden rounded bg-black-50 shadow-lg lg:aspect-auto">
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
