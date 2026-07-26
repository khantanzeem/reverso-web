import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="relative mt-20 overflow-hidden bg-navy text-white/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-heading text-xl font-bold text-white">
            REVERSO<span className="text-signal">.</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Job-oriented telecom &amp; IT training, staffing, and web solutions.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/courses" className="inline-block transition-all hover:translate-x-1 hover:text-signal">Courses</Link></li>
            <li><Link href="/about" className="inline-block transition-all hover:translate-x-1 hover:text-signal">About</Link></li>
            <li><Link href="/contact" className="inline-block transition-all hover:translate-x-1 hover:text-signal">Contact</Link></li>
            <li><Link href="/privacy-policy" className="inline-block transition-all hover:translate-x-1 hover:text-signal">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Contact</h4>
          {settings && (
            <ul className="space-y-2 text-sm">
              <li>{settings.address}</li>
              <li>{settings.phone1}</li>
              <li>{settings.phone2}</li>
              <li>{settings.email}</li>
            </ul>
          )}
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Follow</h4>
          {settings && (
            <ul className="space-y-2 text-sm">
              <li><a href={settings.facebook} className="inline-block transition-all hover:translate-x-1 hover:text-signal">Facebook</a></li>
              <li><a href={settings.instagram} className="inline-block transition-all hover:translate-x-1 hover:text-signal">Instagram</a></li>
              <li><a href={settings.youtube} className="inline-block transition-all hover:translate-x-1 hover:text-signal">YouTube</a></li>
              <li><a href={settings.linkedin} className="inline-block transition-all hover:translate-x-1 hover:text-signal">LinkedIn</a></li>
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Reverso Solutions. All rights reserved.
      </div>
    </footer>
  );
}
