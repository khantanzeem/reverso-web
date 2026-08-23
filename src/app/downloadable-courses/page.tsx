import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { getVideoCourses } from "@/lib/content";
import Reveal from "../components/Reveal";
import FadeUp from "../components/FadeUp";
import CoursePrice from "../components/CoursePrice";

export const metadata = { title: "Downloadable Courses — Reverso Solutions" };

export default async function DownloadableCoursesPage() {
  const courses = await getVideoCourses();
  return (
    <>
      <header className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <h1 className="text-3xl font-extrabold sm:text-4xl">Downloadable Courses</h1>
          </FadeUp>
          <FadeUp delay={120}>
            <p className="mt-2 text-white/70">
              Self-paced recorded video courses — learn on your own schedule.
            </p>
          </FadeUp>
        </div>
      </header>
      <div className="container-x grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 && (
          <p className="col-span-full text-center text-sm text-ink/50">
            No downloadable courses published yet.
          </p>
        )}
        {courses.map((c, i) => (
          <Reveal key={c.id} delay={i * 70}>
            <Link
              href={`/downloadable-courses/${c.slug}`}
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
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy shadow-md">
                  <PlayCircle size={12} /> Self-paced
                </span>
                {c.mrp && c.mrp > c.price && (
                  <span className="absolute right-3 top-3 rounded-full bg-signal px-2.5 py-1 text-xs font-bold text-navy shadow-md">
                    {Math.round(((c.mrp - c.price) / c.mrp) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="p-6">
                <h2 className="font-semibold text-navy transition-colors group-hover:text-signal-600">
                  {c.title}
                </h2>
                <p className="mt-2 text-sm text-ink/70">{c.summary}</p>
                <div className="mt-3">
                  <CoursePrice price={c.price} mrp={c.mrp} size="sm" showBadge={false} />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
