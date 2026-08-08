import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getStaffingSolutions } from "@/lib/content";
import FadeUp from "../../components/FadeUp";
import Reveal from "../../components/Reveal";
import { SERVICE_DETAILS } from "../serviceDetails";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getServiceBySlug(params.slug);
  return { title: service ? `${service.title} — Reverso Solutions` : "Service — Reverso Solutions" };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const [service, staffingSolutions] = await Promise.all([
    getServiceBySlug(params.slug),
    getStaffingSolutions(),
  ]);
  const detail = SERVICE_DETAILS[params.slug];
  if (!service || !detail) notFound();

  const Icon = detail.icon;

  return (
    <article>
      {/* Hero */}
      <header className="relative overflow-hidden bg-navy py-16 text-white sm:py-20">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="blob -left-16 bottom-0 h-64 w-64 bg-signal-600" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <Link href="/services" className="text-sm font-semibold text-white/60 hover:text-white">
              ← All services
            </Link>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/15 text-signal">
              <Icon size={26} />
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <h1 className="mt-5 max-w-2xl text-3xl font-bold sm:text-5xl">{service.title}</h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">{detail.tagline}</p>
          </FadeUp>
          <FadeUp delay={250}>
            <Link href={detail.ctaHref} className="btn btn-primary mt-8">
              {detail.ctaLabel}
            </Link>
          </FadeUp>
        </div>
      </header>

      {/* Stats */}
      <section className="border-b border-black/5 bg-white py-10">
        <div className="container-x grid grid-cols-2 gap-6 sm:grid-cols-4">
          {detail.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <div className="text-center">
                <p className="text-2xl font-bold text-navy sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-ink/60 sm:text-sm">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Overview */}
      <section className="container-x py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            {service.image && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.image} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </Reveal>
          <Reveal delay={100}>
            <div className="space-y-4">
              {detail.longDescription.map((para, i) => (
                <p key={i} className="text-ink/70">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="bg-mist py-16">
        <div className="container-x">
          <Reveal>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">What's included</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {detail.features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 70}>
                <div className="card-hover h-full rounded-2xl border border-black/5 bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-signal/10 text-signal-600">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{feature.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Staffing solutions detail (only for staffing-services) */}
      {detail.slug === "staffing-services" && staffingSolutions.length > 0 && (
        <section className="container-x py-16">
          <Reveal>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">Our staffing solutions</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {staffingSolutions.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <div className="card-hover h-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                  {item.image && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Process */}
      <section className="container-x py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">How it works</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {detail.process.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy text-signal">
                  <step.icon size={20} />
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-signal-600">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-navy py-16 text-white">
        <div className="container-x text-center">
          <Reveal>
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">{detail.tagline}</p>
            <Link href={detail.ctaHref} className="btn btn-primary mt-6">
              {detail.ctaLabel}
            </Link>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
