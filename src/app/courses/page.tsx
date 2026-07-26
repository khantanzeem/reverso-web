import Link from "next/link";
import { getCourses } from "@/lib/content";
import Reveal from "../components/Reveal";
import FadeUp from "../components/FadeUp";

export const metadata = { title: "Courses — Reverso Solutions" };

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <>
      <header className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <h1 className="text-3xl font-extrabold sm:text-4xl">Courses</h1>
          </FadeUp>
          <FadeUp delay={120}>
            <p className="mt-2 text-white/70">Pick a course that fits your goals.</p>
          </FadeUp>
        </div>
      </header>
      <div className="container-x grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
          <Reveal key={c.id} delay={i * 70}>
            <Link
              href={`/courses/${c.slug}`}
              className="card-hover group block h-full overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
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
                <h2 className="font-semibold text-navy transition-colors group-hover:text-signal-600">
                  {c.title}
                </h2>
                <p className="mt-2 text-sm text-ink/70">{c.summary}</p>
                {c.price > 0 && (
                  <p className="mt-3 text-sm font-semibold text-navy">
                    ₹{c.price.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
