import Image from "next/image";
import { SocialLinks } from "@/global-components/modules/social-links";

export function Footer() {
  return (
    <footer className="w-full shrink-0 bg-black-500 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-5 px-6 py-6 sm:flex-row sm:gap-10">
        <Image
          src="/logos/logo-with-text.svg"
          alt="MUAS Logo"
          width={200}
          height={150}
          className="h-auto w-40 sm:w-[200px]"
        />

        <SocialLinks
          includeContact
          className="gap-3 sm:gap-5"
          linkClassName="text-3xl text-white"
        />
      </div>
    </footer>
  );
}
