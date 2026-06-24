import {
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuYoutube,
} from "react-icons/lu";

const socialLinks = [
  {
    icon: LuFacebook,
    href: "https://www.facebook.com/MonashUAS/",
    label: "Facebook",
    external: true,
    group: "social",
  },
  {
    icon: LuInstagram,
    href: "https://www.instagram.com/monash.uas/",
    label: "Instagram",
    external: true,
    group: "social",
  },
  {
    icon: LuLinkedin,
    href: "https://au.linkedin.com/company/monashuas",
    label: "LinkedIn",
    external: true,
    group: "social",
  },
  {
    icon: LuYoutube,
    href: "https://www.youtube.com/@MonashUAS",
    label: "YouTube",
    external: true,
    group: "youtube",
  },
];

type SocialLinksProps = {
  includeYouTube?: boolean;
  className?: string;
  linkClassName?: string;
};

export function SocialLinks({
  includeYouTube = false,
  className = "",
  linkClassName = "",
}: SocialLinksProps) {
  const links = socialLinks.filter((link) => {
    if (link.group === "youtube") return includeYouTube;
    return true;
  });

  return (
    <div className={`flex items-center ${className || "gap-4"}`}>
      {links.map((link) => {
        const Icon = link.icon;
        const sharedProps = {
          "aria-label": link.label,
          className: `inline-flex min-h-11 min-w-11 items-center justify-center rounded transition-colors duration-200 hover:text-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${linkClassName}`,
          children: <Icon aria-hidden="true" />,
        };

        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            {...sharedProps}
          />
        );
      })}
    </div>
  );
}
