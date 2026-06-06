import Link from "next/link";

const navItems = [
  { href: "/our-team", label: "Team" },
  { href: "/our-drones", label: "Drones" },
  { href: "/our-sponsors", label: "Sponsors" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/contact-us", label: "Contact" },
];

export function NavBar() {
  return (
    <header className="border-b border-black-50 bg-background">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-h7 text-blue-900">
          MUAS
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-b2 text-black-300">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-blue-500">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
