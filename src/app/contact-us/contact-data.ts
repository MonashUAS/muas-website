import {
  LuFacebook,
  LuInstagram,
  LuLinkedin,
  LuMail,
  LuYoutube,
} from "react-icons/lu";

export const socialCards = [
  {
    label: "Facebook",
    action: "Follow us",
    href: "https://www.facebook.com/MonashUAS/",
    icon: LuFacebook,
    external: true,
  },
  {
    label: "Instagram",
    action: "Follow us",
    href: "https://www.instagram.com/monash.uas/",
    icon: LuInstagram,
    external: true,
  },
  {
    label: "LinkedIn",
    action: "Connect with us",
    href: "https://au.linkedin.com/company/monashuas",
    icon: LuLinkedin,
    external: true,
  },
  {
    label: "YouTube",
    action: "Subscribe",
    href: "https://www.youtube.com/@MonashUAS",
    icon: LuYoutube,
    external: true,
  },
  {
    label: "Email",
    action: "contact@monashuas.org",
    href: "mailto:contact@monashuas.org",
    icon: LuMail,
    external: false,
  },
];
