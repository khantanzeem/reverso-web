import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayCircle, ShieldCheck } from "lucide-react";
import { getVideoCourseBySlug } from "@/lib/content";
import FadeUp from "../../components/FadeUp";
import Reveal from "../../components/Reveal";
import CoursePrice from "../../components/CoursePrice";

export default async function VideoCourseDetail({ params }: { params: { slug: string } }) {
  const course = await getVideoCourseBySlug(params.slug);
  if (!course) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-signal">
              <PlayCircle size={12} /> Self-paced video course
            </span>
            <h1 className="text-3xl font-bold sm:text-4xl">{course.title}</h1>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="mt-2 max-w-2xl text-white/70">{course.summary}</p>
          </FadeUp>
        </div>
      </header>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {course.image && (
            <Reveal className="mb-8">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-md shadow-navy/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.image} alt="" className="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}
          <Reveal delay={100} className="prose-body">
            <div dangerouslySetInnerHTML={{ __html: course.description }} />
          </Reveal>
        </div>
        <Reveal delay={100}>
          <aside className="sticky top-24 h-fit overflow-hidden rounded-2xl border border-black/5 bg-white shadow-md shadow-navy/5">
            <div className="h-1.5 bg-gradient-to-r from-signal to-navy" />
            <div className="p-6">
              <CoursePrice price={course.price} mrp={course.mrp} size="lg" />
              <Link
                href={`/downloadable-courses/${course.slug}/watch`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-black/10 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:-translate-y-0.5 hover:bg-mist"
              >
                <PlayCircle size={16} /> Watch free preview
              </Link>
              {course.price > 0 && (
                <Link
                  href={`/downloadable-courses/${course.slug}/checkout`}
                  className="btn btn-primary mt-3 w-full"
                >
                  Buy Now
                </Link>
              )}
              <ul className="mt-6 space-y-2.5 border-t border-black/5 pt-5 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-signal-600" />
                  Lifetime access to the video playlist
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-signal-600" />
                  Learn at your own pace
                </li>
              </ul>
            </div>
          </aside>
        </Reveal>
      </div>
    </article>
  );
}
