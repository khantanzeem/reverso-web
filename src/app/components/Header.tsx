import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import MobileNav from "./MobileNav";
import AuthNav from "./AuthNav";

const ALL_NAV = [
  { key: "about", label: "About", href: "/about" },
  { key: "services", label: "Services", href: "/services" },
  { key: "courses", label: "Courses", href: "/courses" },
  { key: "videoCourses", label: "Downloadable Courses", href: "/downloadable-courses" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "demo", label: "Book a Demo", href: "/demo" },
] as const;

export default function Header({ settings }: { settings: SiteSettings | null }) {
  const navConfig = settings?.nav;
  const nav = ALL_NAV.filter((n) => navConfig?.[n.key] !== false);

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
        <Link href="/" className="flex items-center transition-transform hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Reverso Solutions" className="h-9 w-auto sm:h-10" />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="nav-link">
            Home
          </Link>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="nav-link">
              {n.label}
            </Link>
          ))}
          <AuthNav />
        </nav>
        <MobileNav nav={nav} />
      </div>
    </header>
  );
}
