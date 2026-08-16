import Image from "next/image";
import Link from "next/link";
import {
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuYoutube,
} from "react-icons/lu";
import { SearchableText } from "@/global-components/search/searchable-text";

const footerNavigationGroups = [
  {
    label: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/our-team", label: "Our Team" },
      { href: "/our-drones", label: "Our Drones" },
      { href: "/newsletter", label: "Our Newsletters" },
    ],
  },
  {
    label: "NFC 2025",
    links: [{ href: "/nfc-2025", label: "Peregrine MK II" }],
  },
  {
    label: "SUAS 2026",
    links: [
      { href: "/suas-2026-home", label: "Redback" },
      { href: "/suas-2026-team", label: "The SUAS Team" },
    ],
  },
  {
    label: "Connect",
    links: [
      { href: "/our-sponsors", label: "Sponsor Us" },
      { href: "/recruitment", label: "Recruitment" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
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
    <footer
      id="site-footer"
      className="relative z-20 w-full shrink-0 scroll-mt-20 bg-[linear-gradient(155deg,#001f49_0%,#02040a_48%,#05080d_100%)] text-white"
    >
      {/* Footer sections mirror the main navigation hierarchy. */}
      <div className="mx-auto grid w-full max-w-[1500px] gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(300px,1.1fr)_minmax(420px,1.4fr)_minmax(240px,0.8fr)] lg:gap-20 lg:px-12 lg:py-16">
        <div className="flex max-w-lg flex-col items-start gap-5">
          <Image
            src="/logos/logo-white-clear-background.webp"
            alt="MUAS Logo"
            width={197}
            height={56}
            className="h-auto w-40"
          />
          <SearchableText
            as="p"
            searchId="footer-humanitarian-potential"
            className="text-b1 leading-relaxed text-white/64"
          >
            Monash Uncrewed Aerial Systems - Demonstrating the humanitarian potential of Drone Technology since 2011.
          </SearchableText>
        </div>

        <nav aria-label="Footer navigation">
          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
            {footerNavigationGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-4">
                <h2 className="text-caption uppercase tracking-[0.2em] text-blue-100/58">
                  {group.label}
                </h2>
                <div className="grid gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
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
