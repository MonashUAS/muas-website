import Image from "next/image";
import Link from "next/link";

const markClass = "h-14 w-14 object-contain sm:h-16 sm:w-16";

type BrandLinkProps = {
  isMenuOpen: boolean;
  onClick?: () => void;
};

// Handles the MUAS mark-to-lockup animation used by the closed and open nav.
export function BrandLink({ isMenuOpen, onClick }: BrandLinkProps) {
  return (
    <Link
      href="/"
      aria-label="MUAS home"
      onClick={onClick}
      className={`group relative z-10 mx-auto flex h-14 items-center overflow-hidden transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 motion-reduce:transition-none ${
        isMenuOpen ? "w-[148px]" : "w-14 sm:w-14"
      }`}
    >
      {/* Collapsed logo mark. */}
      <Image
        src="/logos/logo.svg"
        alt="MUAS Logo"
        width={100}
        height={100}
        className={`absolute left-0 ${markClass} transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isMenuOpen ? "-translate-x-1 opacity-0" : "translate-x-0 opacity-100"
        }`}
        priority
      />

      {/* Expanded logo lockup. */}
      <Image
        src="/logos/logo-with-text.svg"
        alt="MUAS Logo"
        width={148}
        height={54}
        aria-hidden={!isMenuOpen}
        className={`h-auto w-[148px] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
        }`}
        priority
      />
    </Link>
  );
}
