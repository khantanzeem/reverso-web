import Link from "next/link";
import { Check } from "lucide-react";
import {
  getBanners,
  getServices,
  getCourses,
  getTestimonials,
} from "@/lib/content";
import Reveal from "./components/Reveal";
import StaggerCards, { type StaggerCardItem } from "./components/StaggerCards";
import HeroSlider from "./components/HeroSlider";
import SlideCarousel, { type SlideItem } from "./components/SlideCarousel";

const STAFFING_HIGHLIGHTS = [
  "10+ lakh candidate database across roles and experience levels",
  "Dedicated account manager for every hiring mandate",
  "Fast turnaround — shortlists within 48 hours",
  "Screening, background checks, and offer support included",
];

const STAFFING_SOLUTIONS = [
  {
    id: "career-counseling",
    title: "Career Counseling",
    description:
      "We help freshers and young professionals choose and plan the right career path, with guidance from people who've hired for it.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hire-on-contract",
    title: "Hire on Contract",
    description:
      "A ready bench of vetted, experienced professionals across sectors, available to join your payroll and start delivering fast.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "hire-an-expert",
    title: "Hire an Expert",
    description:
      "Need a specific skill set for a critical role? We source and screen niche experts so you only meet candidates worth interviewing.",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80",
  },
];

export default async function HomePage() {
  const [banners, services, courses, testimonials] = await Promise.all([
    getBanners(),
    getServices(),
    getCourses(),
    getTestimonials(),
  ]);

  const staffing = services.find((s) => s.slug === "staffing-services");

  const staffingSlides: SlideItem[] = STAFFING_SOLUTIONS.map((s) => ({
    id: s.id,
    content: (
      <div className="grid overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm sm:h-80 sm:grid-cols-2">
        <div className="relative aspect-[16/10] sm:aspect-auto sm:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center p-8">
          <h3 className="text-xl font-bold text-navy">{s.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{s.description}</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex w-fit items-center gap-1 text-sm font-semibold text-signal-600 transition-all hover:gap-2"
          >
            Know more <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    ),
  }));

  const testimonialCards: StaggerCardItem[] = testimonials.map((t) => {
    const initials = t.name
      .split(" ")
      .map((n) => n.charAt(0))
      .slice(0, 2)
      .join("");
    return {
      id: t.id,
      content: (
        <>
          {t.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.photo}
              alt=""
              className="mb-4 h-11 w-11 rounded-full object-cover ring-2 ring-white/40 group-data-[center=true]:ring-white/70"
            />
          ) : (
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-signal/10 text-sm font-bold text-signal-600 group-data-[center=true]:bg-white/15 group-data-[center=true]:text-white">
              {initials}
            </span>
          )}
          <p className="text-base font-medium text-navy group-data-[center=true]:text-white">
            &ldquo;{t.quote}&rdquo;
          </p>
          <span className="absolute bottom-6 left-6 right-6 text-sm italic text-ink/60 group-data-[center=true]:text-white/70">
            — {t.name}
          </span>
        </>
      ),
    };
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="blob -left-24 -top-24 h-72 w-72 bg-signal" />
        <div className="blob -right-16 top-1/3 h-96 w-96 bg-signal-600" />
        <div className="blob bottom-0 left-1/3 h-64 w-64 bg-white" />

        <HeroSlider banners={banners} />

        {/* subtle bottom fade into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/5 to-transparent" />
      </section>

      {/* Services */}
      <section className="container-x py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-navy">Our Services</h2>
          <p className="mt-1 text-ink/60">Find the best services for yourself.</p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={i * 100}>
              <article className="card-hover group h-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                  {s.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-lg font-bold text-signal-600 shadow-md">
                    {s.title.charAt(0)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{s.excerpt}</p>
                  <Link
                    href={`/${s.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal-600 transition-all group-hover:gap-2"
                  >
                    Know more <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="relative overflow-hidden bg-mist py-16">
        <div className="container-x relative">
          <Reveal>
            <h2 className="text-2xl font-bold text-navy">Our Courses</h2>
            <p className="mt-1 text-ink/60">Courses we offer.</p>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <Reveal key={c.id} delay={i * 80}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="card-hover group block h-full overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                    {c.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-navy transition-colors group-hover:text-signal-600">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink/70">{c.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-signal-600 opacity-0 transition-all group-hover:gap-2 group-hover:opacity-100">
                      Learn more <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <div className="mt-8">
              <Link href="/courses" className="btn btn-primary">
                View all courses
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Staffing Services spotlight */}
      {staffing && (
        <section className="container-x py-16">
          <Reveal>
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-navy/10">
                {staffing.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={staffing.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-signal-600">
                  Staffing Services
                </p>
                <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
                  {staffing.title}
                </h2>
                <p className="mt-4 text-ink/70">{staffing.excerpt}</p>
                <ul className="mt-6 space-y-3">
                  {STAFFING_HIGHLIGHTS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal-600">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-sm text-ink/80">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="btn btn-primary mt-8">
                  Hire talent with us
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mx-auto mt-14 max-w-3xl px-6 sm:px-8">
              <p className="text-center text-sm font-semibold uppercase tracking-widest text-ink/40">
                Explore our staffing solutions
              </p>
              <div className="mt-6">
                <SlideCarousel items={staffingSlides} />
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Testimonials */}
      <section className="container-x py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-navy">What people say</h2>
        </Reveal>
        <Reveal delay={100}>
          <StaggerCards items={testimonialCards} height={480} />
        </Reveal>
      </section>
    </>
  );
}
