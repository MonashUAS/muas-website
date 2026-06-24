import Image from "next/image";
import { SocialLinks } from "@/global-components/modules/social-links";

export function Footer() {
  return (
    <footer className="w-full shrink-0 bg-black-500 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-4 px-6 py-4 sm:flex-row sm:gap-8">
        <Image
          src="/logos/logo-with-text.svg"
          alt="MUAS Logo"
          width={197}
          height={56}
          className="h-auto w-36 sm:w-40"
        />

        <SocialLinks
          includeYouTube
          className="gap-2 sm:gap-4"
          linkClassName="text-3xl text-white"
        />
      </div>
    </footer>
  );
}
