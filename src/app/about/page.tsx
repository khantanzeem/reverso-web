import { GraduationCap, Laptop, Briefcase, Users } from "lucide-react";
import { getPageBySlug } from "@/lib/content";
import FadeUp from "../components/FadeUp";
import Reveal from "../components/Reveal";

export const metadata = { title: "About Us — Reverso Solutions" };

const STATS = [
  { label: "Students Trained", value: "5,000+" },
  { label: "Students Placed", value: "4,300+" },
  { label: "Training Batches Completed", value: "200+" },
  { label: "Google Reviews", value: "5★" },
];

const WHY_CHOOSE_US = [
  {
    icon: GraduationCap,
    title: "Industry-Aligned Curriculum",
    description: "Courses designed to match current telecom & IT industry trends and job requirements.",
  },
  {
    icon: Laptop,
    title: "Hands-On Learning",
    description: "Practical labs and real-world exercises to build strong technical skills.",
  },
  {
    icon: Briefcase,
    title: "Career & Placement Support",
    description: "Guidance, interview preparation, and placement support for job readiness.",
  },
  {
    icon: Users,
    title: "Personalized Attention",
    description: "Small batch sizes ensure focused learning and individual guidance.",
  },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80",
];

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-16 text-white sm:py-20">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="blob -left-16 bottom-0 h-64 w-64 bg-signal-600" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-signal">
              About Reverso Solutions
            </p>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
              Empowering Future Telecom &amp; IT Professionals
            </h1>
          </FadeUp>
        </div>
      </section>

      {/* Stats */}
      <div className="container-x py-16">
        <div className="grid grid-cols-2 gap-8 divide-y divide-black/5 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="pt-6 text-center sm:pt-0">
              <p className="text-sm font-medium text-ink/60">{s.label}</p>
              <p className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{s.value}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Who We Are */}
      {page && (
        <section className="container-x pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div>
                <h2 className="text-2xl font-bold text-navy sm:text-3xl">Who We Are</h2>
                <div
                  className="prose-body mt-4 text-ink/70"
                  dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="relative">
                <div className="absolute -inset-4 -z-10 rounded-[1.75rem] bg-gradient-to-tr from-signal/25 via-signal/10 to-transparent blur-2xl" />
                {page.videoUrl ? (
                  <div className="aspect-video overflow-hidden rounded-2xl border border-black/5 bg-navy shadow-xl shadow-navy/15">
                    <iframe
                      src={page.videoUrl}
                      title="About Reverso Solutions"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Mission / Vision */}
          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-black/5 bg-mist p-8">
                <h3 className="text-xl font-bold text-navy">Our Mission</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  To provide practical, hands-on telecom and IT training that equips learners with
                  job-ready skills, confidence, and real-world exposure.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="h-full rounded-2xl border border-black/5 bg-mist p-8">
                <h3 className="text-xl font-bold text-navy">Our Vision</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  To become a trusted center of excellence for developing skilled, confident, and
                  employable telecom &amp; IT professionals.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-mist py-16">
        <div className="container-x">
          <Reveal>
            <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
              Why Choose Us
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="card-hover h-full rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-signal/10 text-signal-600">
                    <item.icon size={22} />
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Environment */}
      <section className="container-x py-16">
        <Reveal>
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            Learning Environment
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-ink/60">
            We provide a supportive and engaging learning environment through interactive
            sessions, project-based learning, continuous mentorship, and practical exposure —
            both online and offline — to help students grow with confidence.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {GALLERY.map((src, i) => (
            <Reveal key={src} delay={i * 50}>
              <div className="group aspect-square overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

    </article>
  );
}
