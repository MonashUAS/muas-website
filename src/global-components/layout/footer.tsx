import Image from "next/image";
// Import specific icons from the Font Awesome 6 set
import { LuFacebook, LuInstagram, LuLinkedin,  } from 'react-icons/lu';
import { MdOutlineEmail } from "react-icons/md";

// Social Icon Data
const socials = [
  { icon: <LuFacebook />, href: 'https://www.facebook.com/MonashUAS/', label: 'Facebook' },
  { icon: <LuInstagram />, href: 'https://www.instagram.com/monash.uas/', label: 'Instagram' },
  { icon: <LuLinkedin />, href: 'https://au.linkedin.com/company/monashuas', label: 'LinkedIn' },
  { icon: <MdOutlineEmail />, href: '/contact-us', label: 'Email' }
];

export function Footer() {
  return (
    <footer className="flex items-center justify-center border-t border-black-50 bg-black-500 text-black-50">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-12 px-6 py-6 text-b2">

        <Image src="/logos/logo-with-text.svg" alt="MUAS Logo" width={200} height={150} />

        {/* Social Icons */}
        <div className="flex items-center gap-8">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-3xl hover:text-blue-500 transition-colors duration-200"
            >
              {social.icon}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
