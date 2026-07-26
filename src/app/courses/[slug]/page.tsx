import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/content";
import FadeUp from "../../components/FadeUp";
import Reveal from "../../components/Reveal";

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
          <aside className="h-fit rounded-2xl border border-black/5 bg-white p-6 shadow-md shadow-navy/5">
            {course.price > 0 && (
              <p className="text-2xl font-bold text-navy">
                ₹{course.price.toLocaleString("en-IN")}
              </p>
            )}
            {/* Phase 1: enquiry. Phase 2: this becomes "Buy & watch" via the payment gateway. */}
            <Link href="/contact" className="btn btn-primary mt-4 w-full">
              Enquire / Enroll
            </Link>
            <p className="mt-3 text-xs text-ink/50">
              Speak to our team about batches and free demo classes.
            </p>
          </aside>
        </Reveal>
      </div>
    </article>
  );
}
