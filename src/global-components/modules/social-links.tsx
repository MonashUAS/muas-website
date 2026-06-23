import Link from "next/link";
import { LuFacebook, LuInstagram, LuLinkedin } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";

const socialLinks = [
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
    icon: MdOutlineEmail,
    href: "/contact-us",
    label: "Contact",
    external: false,
  },
];

type SocialLinksProps = {
  includeContact?: boolean;
  className?: string;
  linkClassName?: string;
};

export function SocialLinks({
  includeContact = false,
  className = "",
  linkClassName = "",
}: SocialLinksProps) {
  const links = includeContact
    ? socialLinks
    : socialLinks.filter((link) => link.external);

  return (
    <div className={`flex items-center ${className || "gap-4"}`}>
      {links.map((link) => {
        const Icon = link.icon;
        const sharedProps = {
          "aria-label": link.label,
          className: `inline-flex min-h-11 min-w-11 items-center justify-center rounded transition-colors duration-200 hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${linkClassName}`,
          children: <Icon aria-hidden="true" />,
        };

        return link.external ? (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            {...sharedProps}
          />
        ) : (
          <Link key={link.label} href={link.href} {...sharedProps} />
        );
      })}
    </div>
  );
}
