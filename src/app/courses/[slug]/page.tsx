import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, GraduationCap, ShieldCheck } from "lucide-react";
import { getCourseBySlug } from "@/lib/content";
import FadeUp from "../../components/FadeUp";
import Reveal from "../../components/Reveal";
import CoursePrice from "../../components/CoursePrice";
import CourseCurriculum from "../../components/CourseCurriculum";

export default async function CourseDetail({
  params,
}: {
  params: { slug: string };
}) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  return (
    <article>
      <header className="relative overflow-hidden bg-navy py-14 text-white">
        <div className="blob -right-10 -top-10 h-56 w-56 bg-signal" />
        <div className="container-x relative">
          <FadeUp delay={0}>
            <h1 className="text-3xl font-bold sm:text-4xl">{course.title}</h1>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="mt-2 max-w-2xl text-white/70">{course.summary}</p>
          </FadeUp>
          {(course.duration || course.prerequisites) && (
            <FadeUp delay={200}>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                {course.duration && (
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-signal" />
                    {course.duration}
                  </span>
                )}
                {course.prerequisites && (
                  <span className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-signal" />
                    {course.prerequisites}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-signal" />
                  100% placement assistance
                </span>
              </div>
            </FadeUp>
          )}
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

          {course.curriculum && course.curriculum.length > 0 && (
            <Reveal delay={150} className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-navy">Curriculum</h2>
              <CourseCurriculum modules={course.curriculum} />
            </Reveal>
          )}
        </div>
        <Reveal delay={100}>
          <aside className="sticky top-24 h-fit overflow-hidden rounded-2xl border border-black/5 bg-white shadow-md shadow-navy/5">
            <div className="h-1.5 bg-gradient-to-r from-signal to-navy" />
            <div className="p-6">
              <CoursePrice price={course.price} mrp={course.mrp} size="lg" />
              {course.duration && (
                <p className="mt-3 flex items-center gap-2 text-sm text-ink/60">
                  <Clock size={15} /> {course.duration}
                </p>
              )}
              {/* Phase 1: enquiry. Phase 2: this becomes "Buy & watch" via the payment gateway. */}
              <Link href="/contact" className="btn btn-primary mt-5 w-full">
                Enquire / Enroll
              </Link>
              <ul className="mt-6 space-y-2.5 border-t border-black/5 pt-5 text-sm text-ink/70">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-signal-600" />
                  Certificate of completion
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-signal-600" />
                  Resume prep + mock interviews
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-signal-600" />
                  100% placement assistance
                </li>
              </ul>
              <p className="mt-4 text-xs text-ink/50">
                Speak to our team about batches and free demo classes.
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </article>
  );
}
