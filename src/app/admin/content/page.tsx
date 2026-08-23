"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Check, Image as ImageIcon, Users, Sparkles, MessageSquareQuote } from "lucide-react";
import { db } from "@/lib/firebase";
import type { SiteSettings } from "@/lib/types";

const TEXT_FIELDS: { key: keyof SiteSettings; label: string }[] = [
  { key: "phone1", label: "Phone 1" },
  { key: "phone2", label: "Phone 2" },
  { key: "email", label: "Email" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "hours", label: "Business hours" },
  { key: "address", label: "Address" },
  { key: "facebook", label: "Facebook URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "linkedin", label: "LinkedIn URL" },
];

const SECTION_TOGGLES: { key: keyof NonNullable<SiteSettings["sections"]>; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "services", label: "Services" },
  { key: "courses", label: "Courses" },
  { key: "staffing", label: "Staffing spotlight" },
  { key: "testimonials", label: "Testimonials" },
];

const NAV_TOGGLES: { key: keyof NonNullable<SiteSettings["nav"]>; label: string }[] = [
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "courses", label: "Courses" },
  { key: "contact", label: "Contact" },
  { key: "demo", label: "Book a Demo" },
  { key: "videoCourses", label: "Downloadable Courses" },
];

const SHORTCUTS = [
  { href: "/admin/content/banners", label: "Hero Banners", icon: ImageIcon },
  { href: "/admin/content/services", label: "Services", icon: Sparkles },
  { href: "/admin/content/staffing", label: "Staffing Solutions", icon: Users },
  { href: "/admin/content/testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

export default function AdminContentPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "siteSettings", "global")).then((snap) => {
      setSettings((snap.data() as SiteSettings) || ({} as SiteSettings));
    });
  }, []);

  function setField(key: string, value: unknown) {
    setSettings((s) => ({ ...(s as SiteSettings), [key]: value }));
    setSaved(false);
  }

  function setSection(key: string, value: boolean) {
    setSettings((s) => ({
      ...(s as SiteSettings),
      sections: { ...(s?.sections || {}), [key]: value },
    }));
    setSaved(false);
  }

  function setNav(key: string, value: boolean) {
    setSettings((s) => ({
      ...(s as SiteSettings),
      nav: { ...(s?.nav || {}), [key]: value },
    }));
    setSaved(false);
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    await setDoc(doc(db, "siteSettings", "global"), settings, { merge: true });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-navy">Site Content</h2>
      <p className="mt-1 text-sm text-ink/60">
        Contact details, homepage section visibility, and navigation.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="card-hover flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
              <s.icon size={16} />
            </span>
            <span className="text-sm font-semibold text-navy">{s.label}</span>
          </Link>
        ))}
      </div>

      {!settings ? (
        <p className="mt-8 text-sm text-ink/50">Loading…</p>
      ) : (
        <div className="mt-8 space-y-8">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-navy">Contact details</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.map((f) => (
                <label key={f.key} className="grid gap-1.5 text-sm font-medium text-navy">
                  {f.label}
                  <input
                    value={String(settings[f.key] ?? "")}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="input"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-navy">Homepage sections</h3>
            <p className="mt-1 text-xs text-ink/50">Turn sections on or off without deleting content.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {SECTION_TOGGLES.map((t) => (
                <label key={t.key} className="flex items-center gap-2 text-sm text-navy">
                  <input
                    type="checkbox"
                    checked={settings.sections?.[t.key] !== false}
                    onChange={(e) => setSection(t.key, e.target.checked)}
                    className="h-4 w-4 rounded border-black/20 accent-signal"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-navy">Navigation links</h3>
            <div className="mt-4 flex flex-wrap gap-4">
              {NAV_TOGGLES.map((t) => (
                <label key={t.key} className="flex items-center gap-2 text-sm text-navy">
                  <input
                    type="checkbox"
                    checked={settings.nav?.[t.key] !== false}
                    onChange={(e) => setNav(t.key, e.target.checked)}
                    className="h-4 w-4 rounded border-black/20 accent-signal"
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
            >
              <Check size={15} /> {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && <span className="text-sm text-signal-600">Saved.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
