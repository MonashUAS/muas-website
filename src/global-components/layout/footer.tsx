import Image from "next/image";
import Link from "next/link";
import {
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuYoutube,
} from "react-icons/lu";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/our-team", label: "Our Team" },
  { href: "/our-drones", label: "Our Drones" },
  { href: "/competitions", label: "Competitions" },
  { href: "/our-sponsors", label: "Sponsors" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/contact-us", label: "Contact Us" },
];

const footerSocialLinks = [
  {
    icon: LuFacebook,
    href: "https://www.facebook.com/MonashUAS/",
    label: "Facebook",
    external: true,
  },
  {
    icon: LuInstagram,
    href: "https://www.instagram.com/monash.uas/",
    label: "Instagram",
    external: true,
  },
  {
    icon: LuLinkedin,
    href: "https://au.linkedin.com/company/monashuas",
    label: "LinkedIn",
    external: true,
  },
  {
    icon: LuYoutube,
    href: "https://www.youtube.com/@MonashUAS",
    label: "YouTube",
    external: true,
  },
  {
    icon: LuMail,
    href: "mailto:contact@monashuas.org",
    label: "contact@monashuas.org",
    external: false,
  },
];

const footerLinkClass =
  "w-fit text-b1 text-white/62 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none";

export function Footer() {
  return (
    <footer className="w-full shrink-0 bg-[linear-gradient(155deg,#001f49_0%,#02040a_48%,#05080d_100%)] text-white">
      {/* Three-column footer: brand context, site navigation, and labelled socials. */}
      <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(320px,1.35fr)_minmax(180px,0.8fr)_minmax(260px,0.9fr)] lg:gap-24 lg:px-12 lg:py-16">
        <div className="flex max-w-lg flex-col items-start gap-5">
          <Image
            src="/logos/logo-with-text.svg"
            alt="MUAS Logo"
            width={197}
            height={56}
            className="h-auto w-40"
          />
          <p className="text-b1 leading-relaxed text-white/64">
            Monash Uncrewed Aerial Systems - Demonstrating the humanitarian potential of Drone Technology since 2011
          </p>
        </div>

        <nav className="flex flex-col gap-4" aria-label="Footer navigation">
          <h2 className="text-caption uppercase tracking-[0.2em] text-blue-100/58">
            Navigation
          </h2>
          <div className="grid gap-3">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex flex-col gap-4">
          <h2 className="text-caption uppercase tracking-[0.2em] text-blue-100/58">
            Socials
          </h2>
          {/* Social/contact rows are local here because this footer needs labels beside icons. */}
          <div className="grid gap-2">
            {footerSocialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex min-h-10 w-fit items-center gap-3 text-b1 text-white/62 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/35 motion-reduce:transition-none"
                >
                  <Icon aria-hidden className="h-5 w-5 shrink-0" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Separate copyright row keeps legal/footer maintenance isolated. */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1500px] px-6 py-5 sm:px-8 lg:px-12">
          <p className="text-b2 text-white/48">
            © 2026 Monash Uncrewed Aerial Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
