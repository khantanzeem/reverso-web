import Link from "next/link";
import {
  GraduationCap,
  Users,
  UserSearch,
  FileSignature,
  Search,
  Megaphone,
  LayoutTemplate,
  PenTool,
  Image as ImageIcon,
  GalleryHorizontal,
} from "lucide-react";
import { getServices, getStaffingSolutions } from "@/lib/content";
import FadeUp from "../components/FadeUp";
import Reveal from "../components/Reveal";

export const metadata = { title: "Our Services — Reverso Solutions" };

const STAFFING_ICONS = [UserSearch, FileSignature, Users];

const WEB_ITEMS = [
  { icon: Search, title: "Search Engine Optimization" },
  { icon: Megaphone, title: "Digital Marketing" },
  { icon: LayoutTemplate, title: "Website Design" },
  { icon: PenTool, title: "Logo Design" },
  { icon: ImageIcon, title: "Graphic Design" },
  { icon: GalleryHorizontal, title: "Banner Design" },
];

export default async function ServicesPage() {
  const [services, staffingSolutions] = await Promise.all([
    getServices(),
    getStaffingSolutions(),
  ]);
  const training = services.find((s) => s.slug === "training-and-placement");
  const staffing = services.find((s) => s.slug === "staffing-services");
  const web = services.find((s) => s.slug === "web-solutions");

  return (
    <article>
      {/* Hero */}
      <header className="relative overflow-hidden bg-navy py-16 text-white sm:py-20">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="blob -left-16 bottom-0 h-64 w-64 bg-signal-600" />
        <div className="container-x relative text-center">
          <FadeUp delay={0}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-signal">
              What we do
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="mx-auto max-w-2xl text-3xl font-bold sm:text-5xl">Our Services</h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Training, staffing, and web solutions — everything you need to build a career or
              grow a business, under one roof.
            </p>
          </FadeUp>
        </div>
      </header>

      {/* Training and Placement */}
      {training && (
        <section className="container-x py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              {training.image && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={training.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </Reveal>
            <Reveal delay={100}>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
                  <GraduationCap size={22} />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">
                  Training and Placement
                </h2>
                <p className="mt-4 text-ink/70">
                  Reverso Solutions provides job-oriented training with guidance from
                  professionals who&apos;ve worked at top MNCs. Our team of highly experienced
                  telecom R&amp;D engineers understands current market requirements and helps
                  bridge the gap between industry expectations and your skill set — so you build
                  a career with limitless growth, not just a certificate.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-ink/80">
                  <li>• Job-oriented curriculum built around real industry requirements</li>
                  <li>• Trainers with hands-on experience at top MNCs</li>
                  <li>• Dedicated placement support after course completion</li>
                </ul>
                <Link href="/contact" className="btn btn-primary mt-8">
                  Enquire about training
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Staffing Services */}
      {staffing && (
        <section className="bg-mist py-16">
          <div className="container-x">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <Reveal className="lg:order-2">
                {staffing.image && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={staffing.image} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
              </Reveal>
              <Reveal delay={100} className="lg:order-1">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
                    <Users size={22} />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">
                    Staffing Services
                  </h2>
                  <p className="mt-4 text-ink/70">
                    With a database of over 10 lakh candidates, we match the right talent to your
                    requirements — whether you&apos;re an individual planning your next career
                    move or a company that needs to hire fast, on contract, or for a
                    hard-to-fill specialist role.
                  </p>
                  <Link href="/contact" className="btn btn-primary mt-8">
                    Hire talent with us
                  </Link>
                </div>
              </Reveal>
            </div>

            {staffingSolutions.length > 0 && (
              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {staffingSolutions.map((item, i) => {
                  const Icon = STAFFING_ICONS[i % STAFFING_ICONS.length];
                  return (
                    <Reveal key={item.id} delay={i * 80}>
                      <div className="card-hover h-full rounded-2xl border border-black/5 bg-white p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
                          <Icon size={18} />
                        </div>
                        <h3 className="mt-4 font-semibold text-navy">{item.title}</h3>
                        <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Web Solutions */}
      {web && (
        <section className="container-x py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              {web.image && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={web.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </Reveal>
            <Reveal delay={100}>
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
                  <LayoutTemplate size={22} />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">Web Solutions</h2>
                <p className="mt-4 text-ink/70">
                  Complete web solutions to build and grow your brand online — from responsive
                  website design to content strategy, SEO, and graphic design, all under one
                  roof.
                </p>
                <Link href="/contact" className="btn btn-primary mt-8">
                  Start a web project
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {WEB_ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <div className="card-hover flex h-full flex-col items-center gap-3 rounded-xl border border-black/5 bg-white p-5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
                    <item.icon size={18} />
                  </div>
                  <p className="text-sm font-medium text-navy">{item.title}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="bg-navy py-16 text-white">
        <div className="container-x text-center">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Whether you want to train, hire, or build — our team is ready to help.
            </p>
            <Link href="/contact" className="btn btn-primary mt-6">
              Contact Us
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
