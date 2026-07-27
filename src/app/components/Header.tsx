import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import MobileNav from "./MobileNav";
import AuthNav from "./AuthNav";

const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Courses", href: "/courses" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ settings }: { settings: SiteSettings | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur">
      {settings && (
        <div className="bg-navy text-white">
          <div className="container-x flex flex-wrap items-center justify-between gap-2 py-1.5 text-xs">
            <span>{settings.hours}</span>
            <div className="flex items-center gap-4">
              <a href={`tel:${settings.phone1}`} className="transition-colors hover:text-signal">
                {settings.phone1}
              </a>
              <a href={`mailto:${settings.email}`} className="transition-colors hover:text-signal">
                {settings.email}
              </a>
            </div>
          </div>
        </div>
      )}
      <div className="container-x flex items-center justify-between py-3">
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-navy transition-transform hover:scale-105"
        >
          REVERSO<span className="text-signal">.</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="nav-link">
              {n.label}
            </Link>
          ))}
          <AuthNav />
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
